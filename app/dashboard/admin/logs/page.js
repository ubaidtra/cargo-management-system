'use client';
import { useState, useEffect } from 'react';
import Card from '@/components/Card';

export default function LogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [limit, setLimit] = useState(100);
  const [expandedLogs, setExpandedLogs] = useState(new Set());
  const [weekStart, setWeekStart] = useState('');
  const [weekEnd, setWeekEnd] = useState('');
  const [showWeeklyReport, setShowWeeklyReport] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Set mounted flag to prevent hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      fetchLogs();
    }
  }, [filter, limit, weekStart, weekEnd, mounted]);

  // Set default to current week (only on client)
  useEffect(() => {
    if (!mounted) return;
    
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay()); // Sunday
    startOfWeek.setHours(0, 0, 0, 0);
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Saturday
    endOfWeek.setHours(23, 59, 59, 999);
    
    if (!weekStart) {
      setWeekStart(startOfWeek.toISOString().split('T')[0]);
    }
    if (!weekEnd) {
      setWeekEnd(endOfWeek.toISOString().split('T')[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      let url = `/api/admin/logs?limit=${limit}`;
      if (filter !== 'all') {
        url += `&action=${filter}`;
      }
      if (weekStart) {
        url += `&startDate=${weekStart}`;
      }
      if (weekEnd) {
        url += `&endDate=${weekEnd}`;
      }
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setLogs(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const getWeeklyStats = () => {
    const cargoTransactions = logs.filter(log => 
      log.action.includes('CARGO') && log.details
    );
    
    let totalRevenue = 0;
    let totalTransactions = 0;
    let paidTransactions = 0;
    const operatorStats = {};
    
    cargoTransactions.forEach(log => {
      try {
        const details = JSON.parse(log.details);
        if (details.cost) {
          totalRevenue += parseFloat(details.cost);
          totalTransactions++;
          
          if (details.paymentStatus === 'PAID' || details.newPaymentStatus === 'PAID') {
            paidTransactions++;
          }
          
          // Track by operator
          const operator = log.username || 'Unknown';
          if (!operatorStats[operator]) {
            operatorStats[operator] = { count: 0, revenue: 0 };
          }
          operatorStats[operator].count++;
          operatorStats[operator].revenue += parseFloat(details.cost);
        }
      } catch (e) {
        // Skip invalid JSON
      }
    });
    
    return {
      totalRevenue,
      totalTransactions,
      paidTransactions,
      unpaidTransactions: totalTransactions - paidTransactions,
      operatorStats
    };
  };

  const handlePrintWeeklyReport = () => {
    setShowWeeklyReport(true);
    setTimeout(() => {
      window.print();
      setShowWeeklyReport(false);
    }, 100);
  };

  const formatTimestamp = (timestamp) => {
    if (!mounted) return '';
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (dateString) => {
    if (!mounted || !dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    if (!mounted || !dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getActionColor = (action) => {
    if (action.includes('LOGIN')) return '#10b981';
    if (action.includes('CREATE_CARGO')) return '#3b82f6';
    if (action.includes('PAY_CARGO')) return '#10b981';
    if (action.includes('RECEIVE_CARGO')) return '#22c55e';
    if (action.includes('CREATE')) return '#3b82f6';
    if (action.includes('DELETE')) return '#dc2626';
    if (action.includes('ACTIVATE')) return '#10b981';
    if (action.includes('DEACTIVATE')) return '#f59e0b';
    if (action.includes('RESET')) return '#8b5cf6';
    if (action.includes('FAILED')) return '#ef4444';
    return '#6b7280';
  };

  const toggleExpand = (logId) => {
    const newExpanded = new Set(expandedLogs);
    if (newExpanded.has(logId)) {
      newExpanded.delete(logId);
    } else {
      newExpanded.add(logId);
    }
    setExpandedLogs(newExpanded);
  };

  const parseTransactionDetails = (details) => {
    if (!details) return null;
    try {
      return JSON.parse(details);
    } catch {
      return { raw: details };
    }
  };

  const renderTransactionDetails = (log) => {
    const details = parseTransactionDetails(log.details);
    if (!details || !details.trackingNumber) return null;

    const isCargoTransaction = log.action.includes('CARGO');
    if (!isCargoTransaction) return null;

    return (
      <div style={{ 
        padding: '12px', 
        backgroundColor: 'rgba(255,255,255,0.05)', 
        borderRadius: '4px',
        marginTop: '8px',
        fontSize: '0.875rem'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <strong style={{ color: '#60a5fa' }}>Tracking Number:</strong>{' '}
            <span style={{ color: '#ffffff' }}>{details.trackingNumber}</span>
          </div>
          <div>
            <strong style={{ color: '#60a5fa' }}>Cost:</strong>{' '}
            <span style={{ color: '#ffffff', fontWeight: '600' }}>${details.cost || 'N/A'}</span>
          </div>
          <div>
            <strong style={{ color: '#60a5fa' }}>Sender:</strong>{' '}
            <span style={{ color: '#ffffff' }}>{details.senderName || 'N/A'}</span>
            {details.senderContact && <div style={{ fontSize: '0.8em', color: 'rgba(255,255,255,0.7)', marginTop: '4px' }}>{details.senderContact}</div>}
          </div>
          <div>
            <strong style={{ color: '#60a5fa' }}>Receiver:</strong>{' '}
            <span style={{ color: '#ffffff' }}>{details.receiverName || 'N/A'}</span>
            {details.receiverContact && <div style={{ fontSize: '0.8em', color: 'rgba(255,255,255,0.7)', marginTop: '4px' }}>{details.receiverContact}</div>}
          </div>
          <div>
            <strong style={{ color: '#60a5fa' }}>Destination:</strong>{' '}
            <span style={{ color: '#ffffff' }}>{details.destination || 'N/A'}</span>
          </div>
          <div>
            <strong style={{ color: '#60a5fa' }}>Weight:</strong>{' '}
            <span style={{ color: '#ffffff' }}>{details.weight || 'N/A'} kg</span>
          </div>
          <div>
            <strong style={{ color: '#60a5fa' }}>Items:</strong>{' '}
            <span style={{ color: '#ffffff' }}>{details.numberOfItems || 'N/A'}</span>
            {details.description && <div style={{ fontSize: '0.8em', color: 'rgba(255,255,255,0.7)', marginTop: '4px' }}>{details.description}</div>}
          </div>
          {details.action && (
            <div>
              <strong style={{ color: '#60a5fa' }}>Action:</strong>{' '}
              <span style={{ color: '#ffffff' }}>{details.action}</span>
            </div>
          )}
          {details.previousStatus && (
            <div>
              <strong style={{ color: '#60a5fa' }}>Previous Status:</strong>{' '}
              <span style={{ color: '#ffffff' }}>{details.previousStatus}</span>
            </div>
          )}
          {details.newStatus && (
            <div>
              <strong style={{ color: '#60a5fa' }}>New Status:</strong>{' '}
              <span style={{ color: '#10b981', fontWeight: '600' }}>{details.newStatus}</span>
            </div>
          )}
          {details.previousPaymentStatus && (
            <div>
              <strong style={{ color: '#60a5fa' }}>Previous Payment:</strong>{' '}
              <span style={{ color: '#ffffff' }}>{details.previousPaymentStatus}</span>
            </div>
          )}
          {details.newPaymentStatus && (
            <div>
              <strong style={{ color: '#60a5fa' }}>New Payment:</strong>{' '}
              <span style={{ color: details.newPaymentStatus === 'PAID' ? '#10b981' : '#f59e0b', fontWeight: '600' }}>{details.newPaymentStatus}</span>
            </div>
          )}
          {details.paymentStatus && (
            <div>
              <strong style={{ color: '#60a5fa' }}>Payment Status:</strong>{' '}
              <span style={{ color: details.paymentStatus === 'PAID' ? '#10b981' : '#f59e0b', fontWeight: '600' }}>{details.paymentStatus}</span>
            </div>
          )}
          {details.sendingDate && (
            <div>
              <strong style={{ color: '#60a5fa' }}>Sending Date:</strong>{' '}
                              <span style={{ color: '#ffffff' }}>{formatDate(details.sendingDate)}</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="container">
      <style dangerouslySetInnerHTML={{__html: `
        select option {
          background-color: rgba(0, 0, 0, 0.9) !important;
          color: #ffffff !important;
        }
        select {
          background-color: rgba(0, 0, 0, 0.3) !important;
          color: #ffffff !important;
        }
      `}} />
      <h1>Activity Logs</h1>

      {/* Weekly Report Print View */}
      <div className="print-only" style={{ display: showWeeklyReport ? 'block' : 'none' }}>
          <div style={{ padding: '40px', backgroundColor: 'white', color: 'black' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '20px', borderBottom: '2px solid black', paddingBottom: '10px' }}>
              Weekly Transaction Report
            </h1>
            <div style={{ marginBottom: '20px' }}>
              <p><strong>Period:</strong> {formatDate(weekStart)} to {formatDate(weekEnd)}</p>
              <p><strong>Generated:</strong> {mounted ? formatDateTime(new Date().toISOString()) : 'N/A'}</p>
            </div>
            {(() => {
              const stats = getWeeklyStats();
              return (
                <div style={{ marginBottom: '30px' }}>
                  <h2 style={{ borderBottom: '1px solid #ccc', paddingBottom: '10px', marginBottom: '15px' }}>Summary</h2>
                  <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
                    <tbody>
                      <tr>
                        <td style={{ padding: '8px', border: '1px solid #ccc' }}><strong>Total Transactions</strong></td>
                        <td style={{ padding: '8px', border: '1px solid #ccc' }}>{stats.totalTransactions}</td>
                      </tr>
                      <tr>
                        <td style={{ padding: '8px', border: '1px solid #ccc' }}><strong>Paid Transactions</strong></td>
                        <td style={{ padding: '8px', border: '1px solid #ccc' }}>{stats.paidTransactions}</td>
                      </tr>
                      <tr>
                        <td style={{ padding: '8px', border: '1px solid #ccc' }}><strong>Unpaid Transactions</strong></td>
                        <td style={{ padding: '8px', border: '1px solid #ccc' }}>{stats.unpaidTransactions}</td>
                      </tr>
                      <tr>
                        <td style={{ padding: '8px', border: '1px solid #ccc' }}><strong>Total Revenue</strong></td>
                        <td style={{ padding: '8px', border: '1px solid #ccc' }}>${stats.totalRevenue.toFixed(2)}</td>
                      </tr>
                    </tbody>
                  </table>
                  
                  <h2 style={{ borderBottom: '1px solid #ccc', paddingBottom: '10px', marginBottom: '15px' }}>Transactions by Operator</h2>
                  <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f0f0f0' }}>
                        <th style={{ padding: '8px', border: '1px solid #ccc', textAlign: 'left' }}>Operator</th>
                        <th style={{ padding: '8px', border: '1px solid #ccc', textAlign: 'right' }}>Transactions</th>
                        <th style={{ padding: '8px', border: '1px solid #ccc', textAlign: 'right' }}>Revenue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(stats.operatorStats).map(([operator, data]) => (
                        <tr key={operator}>
                          <td style={{ padding: '8px', border: '1px solid #ccc' }}>{operator}</td>
                          <td style={{ padding: '8px', border: '1px solid #ccc', textAlign: 'right' }}>{data.count}</td>
                          <td style={{ padding: '8px', border: '1px solid #ccc', textAlign: 'right' }}>${data.revenue.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  <h2 style={{ borderBottom: '1px solid #ccc', paddingBottom: '10px', marginBottom: '15px' }}>Transaction Details</h2>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9em' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f0f0f0' }}>
                        <th style={{ padding: '8px', border: '1px solid #ccc', textAlign: 'left' }}>Date</th>
                        <th style={{ padding: '8px', border: '1px solid #ccc', textAlign: 'left' }}>Operator</th>
                        <th style={{ padding: '8px', border: '1px solid #ccc', textAlign: 'left' }}>Action</th>
                        <th style={{ padding: '8px', border: '1px solid #ccc', textAlign: 'left' }}>Tracking #</th>
                        <th style={{ padding: '8px', border: '1px solid #ccc', textAlign: 'left' }}>Sender → Receiver</th>
                        <th style={{ padding: '8px', border: '1px solid #ccc', textAlign: 'right' }}>Cost</th>
                        <th style={{ padding: '8px', border: '1px solid #ccc', textAlign: 'left' }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {logs
                        .filter(log => log.action.includes('CARGO') && log.details)
                        .map(log => {
                          try {
                            const details = JSON.parse(log.details);
                            return (
                              <tr key={log.id}>
                                <td style={{ padding: '8px', border: '1px solid #ccc' }}>{mounted ? formatTimestamp(log.timestamp) : ''}</td>
                                <td style={{ padding: '8px', border: '1px solid #ccc' }}>{log.username || 'Unknown'}</td>
                                <td style={{ padding: '8px', border: '1px solid #ccc' }}>{log.action}</td>
                                <td style={{ padding: '8px', border: '1px solid #ccc' }}>{details.trackingNumber || 'N/A'}</td>
                                <td style={{ padding: '8px', border: '1px solid #ccc' }}>{details.senderName || 'N/A'} → {details.receiverName || 'N/A'}</td>
                                <td style={{ padding: '8px', border: '1px solid #ccc', textAlign: 'right' }}>${details.cost || '0.00'}</td>
                                <td style={{ padding: '8px', border: '1px solid #ccc' }}>{details.paymentStatus || details.newPaymentStatus || 'N/A'}</td>
                              </tr>
                            );
                          } catch (e) {
                            return null;
                          }
                        })}
                    </tbody>
                  </table>
                </div>
              );
            })()}
          </div>
      </div>

      {/* Weekly Stats Summary */}
      {weekStart && weekEnd && logs.length > 0 && (
        <Card className="no-print" style={{ marginBottom: '1rem' }}>
          <h3 style={{ color: '#ffffff', marginBottom: '1rem' }}>Weekly Summary</h3>
          {(() => {
            const stats = getWeeklyStats();
            return (
              <div className="responsive-grid">
                <div>
                  <div style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.7)' }}>Total Transactions</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '600', color: '#ffffff' }}>{stats.totalTransactions}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.7)' }}>Paid</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '600', color: '#10b981' }}>{stats.paidTransactions}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.7)' }}>Unpaid</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '600', color: '#f59e0b' }}>{stats.unpaidTransactions}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.7)' }}>Total Revenue</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '600', color: '#10b981' }}>${stats.totalRevenue.toFixed(2)}</div>
                </div>
              </div>
            );
          })()}
        </Card>
      )}

      <Card className="no-print">
        <div style={{ display: 'flex', gap: '16px', marginBottom: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#ffffff' }}>Week Start</label>
            <input
              type="date"
              value={weekStart}
              onChange={e => setWeekStart(e.target.value)}
              style={{
                padding: '0.5rem',
                backgroundColor: 'rgba(0,0,0,0.3)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '4px',
                color: '#ffffff',
                fontSize: '0.875rem'
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#ffffff' }}>Week End</label>
            <input
              type="date"
              value={weekEnd}
              onChange={e => setWeekEnd(e.target.value)}
              style={{
                padding: '0.5rem',
                backgroundColor: 'rgba(0,0,0,0.3)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '4px',
                color: '#ffffff',
                fontSize: '0.875rem'
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#ffffff' }}>Filter by Action</label>
            <select
              value={filter}
              onChange={e => setFilter(e.target.value)}
              style={{
                padding: '0.5rem',
                backgroundColor: 'rgba(0,0,0,0.3)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '4px',
                color: '#ffffff',
                fontSize: '0.875rem'
              }}
            >
              <option value="all">All Actions</option>
              <option value="LOGIN">Login</option>
              <option value="LOGIN_FAILED">Failed Login</option>
              <option value="CREATE_USER">Create User</option>
              <option value="DELETE_USER">Delete User</option>
              <option value="ACTIVATE_USER">Activate User</option>
              <option value="DEACTIVATE_USER">Deactivate User</option>
              <option value="RESET_PASSWORD">Reset Password</option>
              <option value="CREATE_CARGO">Create Cargo</option>
              <option value="PAY_CARGO">Pay Cargo</option>
              <option value="RECEIVE_CARGO">Receive Cargo</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#ffffff' }}>Limit</label>
            <select
              value={limit}
              onChange={e => setLimit(parseInt(e.target.value))}
              style={{
                padding: '0.5rem',
                backgroundColor: 'rgba(0,0,0,0.3)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '4px',
                color: '#ffffff',
                fontSize: '0.875rem'
              }}
            >
              <option value="50">50</option>
              <option value="100">100</option>
              <option value="200">200</option>
              <option value="500">500</option>
            </select>
          </div>
          <div style={{ marginTop: '1.75rem', display: 'flex', gap: '8px' }}>
            <button
              onClick={fetchLogs}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Refresh
            </button>
            <button
              onClick={handlePrintWeeklyReport}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Print Weekly Report
            </button>
          </div>
        </div>

        {loading ? (
          <p style={{ textAlign: 'center', padding: '2rem', color: 'rgba(255,255,255,0.5)' }}>
            Loading logs...
          </p>
        ) : logs.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '2rem', color: 'rgba(255,255,255,0.5)' }}>
            No logs found.
          </p>
        ) : (
          <div className="table-wrapper" style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
                  <th style={{ textAlign: 'left', padding: '8px', fontSize: '0.875rem', width: '40px', color: '#ffffff', fontWeight: '600' }}></th>
                  <th style={{ textAlign: 'left', padding: '8px', fontSize: '0.875rem', color: '#ffffff', fontWeight: '600' }}>Timestamp</th>
                  <th style={{ textAlign: 'left', padding: '8px', fontSize: '0.875rem', color: '#ffffff', fontWeight: '600' }}>Action</th>
                  <th style={{ textAlign: 'left', padding: '8px', fontSize: '0.875rem', color: '#ffffff', fontWeight: '600' }}>Operator</th>
                  <th style={{ textAlign: 'left', padding: '8px', fontSize: '0.875rem', color: '#ffffff', fontWeight: '600' }}>Summary</th>
                </tr>
              </thead>
              <tbody>
                {logs.map(log => {
                  const isExpanded = expandedLogs.has(log.id);
                  const details = parseTransactionDetails(log.details);
                  const hasTransactionDetails = details && details.trackingNumber;
                  const summary = hasTransactionDetails 
                    ? `Tracking: ${details.trackingNumber} | ${details.senderName} → ${details.receiverName} | $${details.cost}`
                    : log.details || '-';
                  
                  return (
                    <>
                      <tr 
                        key={log.id} 
                        style={{ 
                          borderBottom: '1px solid rgba(255,255,255,0.1)',
                          cursor: hasTransactionDetails ? 'pointer' : 'default'
                        }}
                        onClick={() => hasTransactionDetails && toggleExpand(log.id)}
                      >
                        <td style={{ padding: '12px 8px' }}>
                          {hasTransactionDetails && (
                            <span style={{ fontSize: '0.875rem', color: '#60a5fa', fontWeight: '600' }}>
                              {isExpanded ? '▼' : '▶'}
                            </span>
                          )}
                        </td>
                        <td style={{ padding: '12px 8px', fontSize: '0.875rem', color: '#ffffff' }}>
                          {formatTimestamp(log.timestamp)}
                        </td>
                        <td style={{ padding: '12px 8px' }}>
                          <span
                            style={{
                              padding: '4px 8px',
                              borderRadius: '4px',
                              fontSize: '0.75rem',
                              backgroundColor: `${getActionColor(log.action)}20`,
                              color: getActionColor(log.action),
                              fontWeight: '500'
                            }}
                          >
                            {log.action}
                          </span>
                        </td>
                        <td style={{ padding: '12px 8px', fontSize: '0.875rem', fontWeight: '600', color: '#ffffff' }}>
                          {log.username || '-'}
                        </td>
                        <td style={{ padding: '12px 8px', fontSize: '0.875rem', color: '#ffffff' }}>
                          {summary}
                        </td>
                      </tr>
                      {isExpanded && hasTransactionDetails && (
                        <tr key={`${log.id}-details`}>
                          <td colSpan="5" style={{ padding: '0 8px 12px 8px' }}>
                            {renderTransactionDetails(log)}
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

