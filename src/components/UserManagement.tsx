"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter,
  Edit,
  Trash2,
  Shield,
  Key,
  CheckCircle,
  XCircle,
  Clock,
  Mail,
  Phone,
  Calendar,
  Settings,
  Plus,
  UserCheck,
  UserX
} from "lucide-react";
import { createTenantContext } from "@/lib/db";

interface User {
  id: string;
  email: string;
  name?: string | null;
  role: string;
  status: string;
  lastLogin?: string | null;
  createdAt: string | Date;
  roles: UserRole[];
  permissions: UserPermission[];
}

interface Role {
  id: string;
  name: string;
  description?: string | null;
  isActive: boolean;
  createdAt: string | Date;
  permissions: RolePermission[];
}

interface Permission {
  id: string;
  name: string;
  description?: string | null;
  category: string;
}

interface UserRole {
  id: string;
  role: Role;
}

interface UserPermission {
  id: string;
  permission: Permission;
}

interface RolePermission {
  id: string;
  permission: Permission;
}

interface NewUser {
  email: string;
  name?: string;
  role: string;
  status: string;
}

interface NewRole {
  name: string;
  description?: string;
  permissions: string[];
}

export default function UserManagement() {
  const { data: session, status } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [newUser, setNewUser] = useState<NewUser>({
    email: "",
    name: "",
    role: "user",
    status: "active"
  });
  const [newRole, setNewRole] = useState<NewRole>({
    name: "",
    description: "",
    permissions: []
  });

  useEffect(() => {
    if (status === "loading") return;
    if (!session) return;

    const fetchData = async () => {
      try {
        const tenantId = session.user.tenantId;
        const tenantDb = createTenantContext(tenantId);

        // Fetch users with roles and permissions
        const usersData = await tenantDb.user({
          include: {
            userRoles: {
              include: {
                role: {
                  include: {
                    rolePermissions: {
                      include: {
                        permission: true
                      }
                  }
                }
              }
            }
          },
          userPermissions: {
            include: {
              permission: true
            }
          }
        },
          orderBy: { createdAt: 'desc' }
        });

        const formattedUsers = usersData.map(user => ({
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          status: user.status,
          lastLogin: user.lastLogin ? user.lastLogin.toISOString() : null,
          createdAt: user.createdAt.toISOString(),
          roles: (user as any).userRoles || [],
          permissions: (user as any).userPermissions || []
        }));

        // Fetch roles with permissions
        const rolesData = await tenantDb.role({
          include: {
            rolePermissions: {
              include: {
                permission: true
              }
            }
          },
          orderBy: { name: 'asc' }
        });

        const formattedRoles = rolesData.map(role => ({
          id: role.id,
          name: role.name,
          description: role.description,
          isActive: role.isActive,
          createdAt: role.createdAt.toISOString(),
          permissions: (role as any).rolePermissions || []
        }));

        // Fetch permissions
        const permissionsData = await tenantDb.permission({
          orderBy: { category: 'asc', name: 'asc' }
        });

        setUsers(formattedUsers);
        setRoles(formattedRoles);
        setPermissions(permissionsData);
      } catch (error) {
        console.error("Error fetching user management data:", error);
        // Fallback to mock data
        const mockUsers: User[] = [
          {
            id: "1",
            email: "admin@company.com",
            name: "John Doe",
            role: "admin",
            status: "active",
            lastLogin: new Date(Date.now() - 3600000).toISOString(),
            createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
            roles: [],
            permissions: []
          },
          {
            id: "2",
            email: "manager@company.com",
            name: "Jane Smith",
            role: "field_officer",
            status: "active",
            lastLogin: new Date(Date.now() - 7200000).toISOString(),
            createdAt: new Date(Date.now() - 86400000 * 15).toISOString(),
            roles: [],
            permissions: []
          }
        ];

        const mockRoles: Role[] = [
          {
            id: "1",
            name: "super_admin",
            description: "Super administrator with full access",
            isActive: true,
            createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
            permissions: []
          },
          {
            id: "2",
            name: "admin",
            description: "Administrator with limited access",
            isActive: true,
            createdAt: new Date(Date.now() - 86400000 * 20).toISOString(),
            permissions: []
          }
        ];

        const mockPermissions: Permission[] = [
          { id: "1", name: "users.read", description: "Read user data", category: "users" },
          { id: "2", name: "users.create", description: "Create users", category: "users" },
          { id: "3", name: "guards.read", description: "Read guard data", category: "guards" },
          { id: "4", name: "guards.create", description: "Create guards", category: "guards" }
        ];

        setUsers(mockUsers);
        setRoles(mockRoles);
        setPermissions(mockPermissions);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [status, session]);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-500";
      case "inactive": return "bg-gray-500";
      case "suspended": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "super_admin": return "bg-purple-500";
      case "admin": return "bg-blue-500";
      case "field_officer": return "bg-yellow-500";
      case "guard": return "bg-green-500";
      case "user": return "bg-gray-500";
      default: return "bg-gray-500";
    }
  };

  const handleCreateUser = async () => {
    if (!session) return;

    try {
      const tenantId = session.user.tenantId;
      const tenantDb = createTenantContext(tenantId);

      const user = await tenantDb.createUser({
        data: {
          email: newUser.email,
          name: newUser.name,
          role: newUser.role,
          status: newUser.status
        }
      });

      // Add to local state
      setUsers(prev => [{
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        status: user.status,
        createdAt: user.createdAt,
        roles: [],
        permissions: []
      }, ...prev]);

      // Reset form and close dialog
      setNewUser({
        email: "",
        name: "",
        role: "user",
        status: "active"
      });
      setIsUserDialogOpen(false);
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  const handleCreateRole = async () => {
    if (!session) return;

    try {
      const tenantId = session.user.tenantId;
      const tenantDb = createTenantContext(tenantId);

      const role = await tenantDb.createRole({
        data: {
          name: newRole.name,
          description: newRole.description
        },
        include: {
          rolePermissions: {
            include: {
              permission: true
            }
          }
        }
      });

      // Add permissions to role
      if (newRole.permissions.length > 0) {
        await tenantDb.createManyRolePermission({
          data: newRole.permissions.map(permissionId => ({
            roleId: role.id,
            permissionId
          }))
        });
      }

      // Add to local state
      setRoles(prev => [{
        id: role.id,
        name: role.name,
        description: role.description,
        isActive: role.isActive,
        createdAt: role.createdAt,
        permissions: []
      }, ...prev]);

      // Reset form and close dialog
      setNewRole({
        name: "",
        description: "",
        permissions: []
      });
      setIsRoleDialogOpen(false);
    } catch (error) {
      console.error("Error creating role:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">User & Role Management</h1>
          <p className="text-muted-foreground">Manage users, roles, and permissions</p>
        </div>
        <div className="flex space-x-2">
          <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="w-4 h-4 mr-2" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create New User</DialogTitle>
                <DialogDescription>
                  Add a new user to the system
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="user@example.com"
                  />
                </div>
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={newUser.name}
                    onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Full name"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="role">Role</Label>
                    <Select value={newUser.role} onValueChange={(value) => setNewUser(prev => ({ ...prev, role: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="super_admin">Super Admin</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="field_officer">Field Officer</SelectItem>
                        <SelectItem value="guard">Guard</SelectItem>
                        <SelectItem value="user">User</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select value={newUser.status} onValueChange={(value) => setNewUser(prev => ({ ...prev, status: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="suspended">Suspended</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsUserDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateUser}>
                    Create User
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Shield className="w-4 h-4 mr-2" />
                Add Role
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Role</DialogTitle>
                <DialogDescription>
                  Define a new role with specific permissions
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="roleName">Role Name</Label>
                  <Input
                    id="roleName"
                    value={newRole.name}
                    onChange={(e) => setNewRole(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Role name"
                  />
                </div>
                <div>
                  <Label htmlFor="roleDescription">Description</Label>
                  <Input
                    id="roleDescription"
                    value={newRole.description}
                    onChange={(e) => setNewRole(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Role description"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsRoleDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateRole}>
                    Create Role
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="roles">Roles</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          {/* Filters */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Search className="w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="super_admin">Super Admin</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="field_officer">Field Officer</SelectItem>
                <SelectItem value="guard">Guard</SelectItem>
                <SelectItem value="user">User</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Users Table */}
          <Card>
            <CardHeader>
              <CardTitle>System Users</CardTitle>
              <CardDescription>Manage user accounts and access</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium">
                              {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium">{user.name || 'Unknown'}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={`${getRoleColor(user.role)} text-white`}>
                          {user.role.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`${getStatusColor(user.status)} text-white`}>
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1 text-sm">
                          <Clock className="w-4 h-4" />
                          <span>
                            {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Roles</CardTitle>
              <CardDescription>Manage user roles and permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {roles.map((role) => (
                  <div key={role.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Shield className="w-5 h-5 text-blue-500" />
                        <div>
                          <h3 className="font-medium">{role.name.replace('_', ' ')}</h3>
                          <p className="text-sm text-muted-foreground">{role.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={role.isActive ? "default" : "secondary"}>
                          {role.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                        <Badge variant="outline">
                          {role.permissions.length} permissions
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Key className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="permissions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Permissions</CardTitle>
              <CardDescription>Available permissions for roles and users</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {Object.entries(
                  permissions.reduce((acc, permission) => {
                    if (!acc[permission.category]) {
                      acc[permission.category] = [];
                    }
                    acc[permission.category].push(permission);
                    return acc;
                  }, {} as Record<string, Permission[]>)
                ).map(([category, categoryPermissions]) => (
                  <div key={category} className="space-y-2">
                    <h3 className="font-medium text-lg capitalize">{category}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                      {categoryPermissions.map((permission) => (
                        <div key={permission.id} className="flex items-center justify-between p-2 border rounded">
                          <div>
                            <p className="font-medium text-sm">{permission.name}</p>
                            <p className="text-xs text-muted-foreground">{permission.description}</p>
                          </div>
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}