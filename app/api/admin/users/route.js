import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { logActivity } from '@/lib/logger';
import { isSuperAdmin, isSuperAdminById } from '@/lib/auth';

export async function GET() {
  try {
    // Try to fetch with isActive, fallback if field doesn't exist
    let users;
    try {
      users = await prisma.user.findMany({
        select: { 
          id: true, 
          username: true, 
          role: true, 
          isActive: true,
          country: true,
          branch: true,
          email: true,
          address: true,
          contact: true
        } // Don't return passwords
      });
    } catch (schemaError) {
      // If isActive field doesn't exist, fetch without it
      if (schemaError.message && schemaError.message.includes('isActive')) {
        console.warn('isActive field not found, fetching users without it. Please run: npx prisma db push');
        const usersWithoutActive = await prisma.user.findMany({
          select: { 
            id: true, 
            username: true, 
            role: true,
            country: true,
            branch: true,
            email: true,
            address: true,
            contact: true
          }
        });
        // Add default isActive for all users
        users = usersWithoutActive.map(u => ({ ...u, isActive: true }));
      } else {
        throw schemaError;
      }
    }
    return NextResponse.json(users);
  } catch (error) {
    console.error('Fetch users error:', error);
    return NextResponse.json({ error: 'Failed to fetch users', details: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { username, password, role, country, branch, email, address, contact } = body;

    if (!username || !password) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const userRole = role === 'ADMIN' ? 'ADMIN' : 'OPERATOR';

    // Try to create user with isActive field, fallback if schema not updated
    let user;
    try {
      user = await prisma.user.create({
        data: {
          username,
          password, // Storing plain text for this MVP as requested
          role: userRole,
          isActive: true,
          country: country || null,
          branch: branch || null,
          email: email || null,
          address: address || null,
          contact: contact || null
        },
      });
    } catch (schemaError) {
      // If isActive field doesn't exist, try without it
      if (schemaError.message && schemaError.message.includes('isActive')) {
        console.warn('isActive field not found, creating user without it. Please run: npx prisma db push');
        user = await prisma.user.create({
          data: {
            username,
            password,
            role: userRole
          },
        });
        // Add isActive default for response
        user.isActive = true;
      } else {
        throw schemaError;
      }
    }

    // Log the activity (don't fail if ActivityLog doesn't exist)
    try {
      await logActivity('CREATE_USER', user.id, username, `Created ${userRole} account`);
    } catch (logError) {
      console.warn('Failed to log activity (ActivityLog table may not exist):', logError.message);
    }

    return NextResponse.json({ 
      id: user.id, 
      username: user.username, 
      role: user.role, 
      isActive: user.isActive || true,
      country: user.country || null,
      branch: user.branch || null,
      email: user.email || null,
      address: user.address || null,
      contact: user.contact || null
    });
  } catch (error) {
    console.error('Create user error:', error);
    console.error('Error details:', {
      code: error.code,
      message: error.message,
      meta: error.meta
    });
    
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Username already exists' }, { status: 400 });
    }
    
    // Return more detailed error message
    let errorMessage = 'Failed to create user';
    
    // Check for common schema-related errors
    if (error.message && error.message.includes('Unknown field')) {
      errorMessage = 'Database schema needs to be updated. Please run: npx prisma db push';
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    return NextResponse.json({ 
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? {
        message: error.message,
        code: error.code,
        meta: error.meta
      } : undefined
    }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('id');
    const currentUserId = searchParams.get('currentUserId');
    const currentUsername = searchParams.get('currentUsername');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Check if current user is super admin
    const isCurrentUserSuperAdmin = isSuperAdminById(currentUserId, currentUsername);

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, username: true, role: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Prevent deleting super admin (ubaidtra)
    if (isSuperAdmin(user.username)) {
      return NextResponse.json({ error: 'Cannot delete super admin account' }, { status: 403 });
    }

    // Only super admin can delete admin accounts, regular admins can only delete operators
    if (user.role === 'ADMIN' && !isCurrentUserSuperAdmin) {
      return NextResponse.json({ error: 'Only super admin can delete admin accounts' }, { status: 403 });
    }

    // Delete the user
    await prisma.user.delete({
      where: { id: userId }
    });

    // Log the activity
    try {
      await logActivity('DELETE_USER', userId, user.username, `Deleted ${user.role} account`);
    } catch (logError) {
      console.warn('Failed to log activity:', logError.message);
    }

    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const body = await request.json();
    const { userId, action, newPassword, currentUserId, currentUsername, profileData } = body;

    if (!userId || !action) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if current user is super admin
    const isCurrentUserSuperAdmin = isSuperAdminById(currentUserId, currentUsername);

    // Try to fetch user - Prisma doesn't error on select, but we check if isActive exists
    let user;
    try {
      user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, username: true, role: true, isActive: true, country: true, branch: true, email: true, address: true, contact: true }
      });
      // If isActive is undefined, the field doesn't exist in DB
      if (user && user.isActive === undefined) {
        user.isActive = true; // Default to active
      }
    } catch (queryError) {
      console.error('Error fetching user:', queryError);
      // Try without isActive field
      try {
        user = await prisma.user.findUnique({
          where: { id: userId },
          select: { id: true, username: true, role: true }
        });
        if (user) {
          user.isActive = true; // Default to active
        }
      } catch (fallbackError) {
        throw queryError; // Throw original error
      }
    }

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Prevent modifying super admin account
    if (isSuperAdmin(user.username)) {
      return NextResponse.json({ error: 'Cannot modify super admin account' }, { status: 403 });
    }

    let updatedUser;
    let logAction;
    let logDetails;

    switch (action) {
      case 'activate':
        try {
          updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { isActive: true },
            select: { id: true, username: true, role: true, isActive: true, country: true, branch: true, email: true, address: true, contact: true }
          });
        } catch (schemaError) {
          // Check if error is due to missing isActive field
          const errorMsg = schemaError.message || '';
          if (errorMsg.includes('isActive') || errorMsg.includes('Unknown field') || errorMsg.includes('Unknown argument')) {
            console.warn('isActive field not found in database. User is already active by default.');
            // Return user as-is since they're already active (default state)
            updatedUser = { ...user, isActive: true };
          } else {
            // Re-throw if it's a different error
            throw schemaError;
          }
        }
        logAction = 'ACTIVATE_USER';
        logDetails = `Activated ${user.role} account: ${user.username}`;
        break;

      case 'deactivate':
        // Prevent deactivating super admin account
        if (isSuperAdmin(user.username)) {
          return NextResponse.json({ error: 'Cannot deactivate super admin account' }, { status: 403 });
        }
        
        // Prevent deactivating the last admin (unless super admin)
        if (user.role === 'ADMIN' && !isCurrentUserSuperAdmin) {
          try {
            const adminCount = await prisma.user.count({
              where: { role: 'ADMIN', isActive: true }
            });
            if (adminCount <= 1) {
              return NextResponse.json({ error: 'Cannot deactivate the last active admin' }, { status: 403 });
            }
          } catch (schemaError) {
            // If isActive doesn't exist, skip this check
            if (!schemaError.message || !schemaError.message.includes('isActive')) {
              throw schemaError;
            }
          }
        }
        try {
          updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { isActive: false },
            select: { id: true, username: true, role: true, isActive: true, country: true, branch: true, email: true, address: true, contact: true }
          });
        } catch (schemaError) {
          // Check if error is due to missing isActive field
          const errorMsg = schemaError.message || '';
          if (errorMsg.includes('isActive') || errorMsg.includes('Unknown field') || errorMsg.includes('Unknown argument')) {
            return NextResponse.json({ 
              error: 'Cannot deactivate user: Database schema needs to be updated. Please run: npx prisma db push',
              details: process.env.NODE_ENV === 'development' ? {
                message: schemaError.message,
                code: schemaError.code
              } : undefined
            }, { status: 500 });
          } else {
            // Re-throw if it's a different error (like user not found, etc.)
            throw schemaError;
          }
        }
        logAction = 'DEACTIVATE_USER';
        logDetails = `Deactivated ${user.role} account: ${user.username}`;
        break;

      case 'resetPassword':
        if (!newPassword) {
          return NextResponse.json({ error: 'New password is required' }, { status: 400 });
        }
        try {
          updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { password: newPassword },
            select: { id: true, username: true, role: true, isActive: true, country: true, branch: true, email: true, address: true, contact: true }
          });
        } catch (schemaError) {
          // If isActive field doesn't exist, fetch without it
          if (schemaError.message && schemaError.message.includes('isActive')) {
            updatedUser = await prisma.user.update({
              where: { id: userId },
              data: { password: newPassword },
              select: { id: true, username: true, role: true }
            });
            updatedUser.isActive = user.isActive || true;
          } else {
            throw schemaError;
          }
        }
        logAction = 'RESET_PASSWORD';
        logDetails = `Reset password for ${user.role} account: ${user.username}`;
        break;

      case 'updateProfile':
        if (!profileData) {
          return NextResponse.json({ error: 'Profile data is required' }, { status: 400 });
        }
        try {
          const updateData = {};
          if (profileData.country !== undefined) updateData.country = profileData.country || null;
          if (profileData.branch !== undefined) updateData.branch = profileData.branch || null;
          if (profileData.email !== undefined) updateData.email = profileData.email || null;
          if (profileData.address !== undefined) updateData.address = profileData.address || null;
          if (profileData.contact !== undefined) updateData.contact = profileData.contact || null;
          
          updatedUser = await prisma.user.update({
            where: { id: userId },
            data: updateData,
            select: { id: true, username: true, role: true, isActive: true, country: true, branch: true, email: true, address: true, contact: true }
          });
        } catch (schemaError) {
          // Handle schema errors gracefully
          const errorMsg = schemaError.message || '';
          if (errorMsg.includes('country') || errorMsg.includes('branch') || errorMsg.includes('email') || errorMsg.includes('address') || errorMsg.includes('contact')) {
            return NextResponse.json({ 
              error: 'Database schema needs to be updated. Please run: npx prisma db push' 
            }, { status: 500 });
          } else {
            throw schemaError;
          }
        }
        logAction = 'UPDATE_PROFILE';
        logDetails = `Updated profile for ${user.role} account: ${user.username}`;
        break;

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    // Log the activity (don't fail if ActivityLog doesn't exist)
    try {
      await logActivity(logAction, userId, user.username, logDetails);
    } catch (logError) {
      console.warn('Failed to log activity (ActivityLog table may not exist):', logError.message);
    }

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Update user error:', error);
    console.error('Error details:', {
      code: error.code,
      message: error.message,
      meta: error.meta
    });
    
    // Return more detailed error message
    let errorMessage = 'Failed to update user';
    
    // Check for common schema-related errors
    if (error.message && error.message.includes('Unknown field')) {
      errorMessage = 'Database schema needs to be updated. Please run: npx prisma db push';
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    return NextResponse.json({ 
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? {
        message: error.message,
        code: error.code,
        meta: error.meta
      } : undefined
    }, { status: 500 });
  }
}

