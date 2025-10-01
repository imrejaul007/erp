'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import {
  GitBranch,
  History,
  Plus,
  Eye,
  Archive,
  CheckCircle,
  Clock,
  User,
  FileText,
  ArrowRight
} from 'lucide-react';
import { Recipe, RecipeVersion } from '@/types/production';
import { format } from 'date-fns';

interface RecipeVersionControlProps {
  recipe: Recipe;
  versions: RecipeVersion[];
  onCreateVersion: (data: { version: string; changes: string }) => void;
  onActivateVersion: (versionId: string) => void;
  onCompareVersions: (version1Id: string, version2Id: string) => void;
}

const RecipeVersionControl: React.FC<RecipeVersionControlProps> = ({
  recipe,
  versions,
  onCreateVersion,
  onActivateVersion,
  onCompareVersions
}) => {
  const [isCreateVersionOpen, setIsCreateVersionOpen] = useState(false);
  const [newVersionNumber, setNewVersionNumber] = useState('');
  const [versionChanges, setVersionChanges] = useState('');
  const [selectedVersions, setSelectedVersions] = useState<string[]>([]);

  // Sort versions by date (newest first)
  const sortedVersions = [...versions].sort((a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const handleCreateVersion = () => {
    if (!newVersionNumber.trim() || !versionChanges.trim()) return;

    onCreateVersion({
      version: newVersionNumber,
      changes: versionChanges
    });

    // Reset form
    setNewVersionNumber('');
    setVersionChanges('');
    setIsCreateVersionOpen(false);
  };

  const generateNextVersionNumber = () => {
    if (versions.length === 0) return '1.0';

    const currentVersion = recipe.version;
    const [major, minor] = currentVersion.split('.').map(Number);

    // If minor version would go beyond 9, increment major and reset minor
    if (minor >= 9) {
      return `${major + 1}.0`;
    }

    return `${major}.${minor + 1}`;
  };

  const handleVersionSelect = (versionId: string) => {
    if (selectedVersions.includes(versionId)) {
      setSelectedVersions(prev => prev.filter(id => id !== versionId));
    } else if (selectedVersions.length < 2) {
      setSelectedVersions(prev => [...prev, versionId]);
    } else {
      // Replace the first selected version
      setSelectedVersions([selectedVersions[1], versionId]);
    }
  };

  const handleCompareVersions = () => {
    if (selectedVersions.length === 2) {
      onCompareVersions(selectedVersions[0], selectedVersions[1]);
    }
  };

  const getVersionStatusBadge = (version: RecipeVersion) => {
    if (version.version === recipe.version) {
      return <Badge className="bg-green-100 text-green-800">Active</Badge>;
    }
    return <Badge variant="secondary">Archived</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Current Version Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GitBranch className="w-5 h-5" />
              Current Version: {recipe.version}
            </div>
            <Dialog open={isCreateVersionOpen} onOpenChange={setIsCreateVersionOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  New Version
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Recipe Version</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="newVersion">Version Number</Label>
                    <Input
                      id="newVersion"
                      value={newVersionNumber}
                      onChange={(e) => setNewVersionNumber(e.target.value)}
                      placeholder={`Suggested: ${generateNextVersionNumber()}`}
                    />
                  </div>
                  <div>
                    <Label htmlFor="changes">Changes Description *</Label>
                    <Textarea
                      id="changes"
                      value={versionChanges}
                      onChange={(e) => setVersionChanges(e.target.value)}
                      placeholder="Describe what changes were made in this version..."
                      rows={4}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsCreateVersionOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleCreateVersion}>
                      Create Version
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h4 className="font-medium text-sm text-gray-600">Total Versions</h4>
              <p className="text-2xl font-bold">{versions.length}</p>
            </div>
            <div>
              <h4 className="font-medium text-sm text-gray-600">Last Updated</h4>
              <p className="text-lg">
                {recipe.updatedAt ? format(new Date(recipe.updatedAt), 'MMM dd, yyyy') : '-'}
              </p>
            </div>
            <div>
              <h4 className="font-medium text-sm text-gray-600">Status</h4>
              <Badge className={recipe.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                {recipe.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Version Comparison Controls */}
      {selectedVersions.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  Selected: {selectedVersions.length}/2 versions
                </span>
                {selectedVersions.length === 2 && (
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setSelectedVersions([])}
                  size="sm"
                >
                  Clear Selection
                </Button>
                {selectedVersions.length === 2 && (
                  <Button onClick={handleCompareVersions} size="sm">
                    Compare Versions
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Version History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="w-5 h-5" />
            Version History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {sortedVersions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No version history available</p>
              <p className="text-sm">Create a new version to start tracking changes</p>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedVersions.map((version, index) => (
                <div
                  key={version.id}
                  className={`border rounded-lg p-4 transition-colors ${
                    selectedVersions.includes(version.id)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <input
                          type="checkbox"
                          checked={selectedVersions.includes(version.id)}
                          onChange={() => handleVersionSelect(version.id)}
                          className="w-4 h-4 text-blue-600 rounded"
                        />
                        <h3 className="font-semibold text-lg">
                          Version {version.version}
                        </h3>
                        {getVersionStatusBadge(version)}
                        {index === 0 && (
                          <Badge variant="outline" className="text-xs">
                            Latest
                          </Badge>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="w-4 h-4" />
                          {format(new Date(version.createdAt), 'MMM dd, yyyy HH:mm')}
                        </div>
                        {version.createdBy && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <User className="w-4 h-4" />
                            {version.createdBy}
                          </div>
                        )}
                      </div>

                      {version.changes && (
                        <div className="bg-gray-50 rounded-md p-3 mb-3">
                          <div className="flex items-start gap-2">
                            <FileText className="w-4 h-4 mt-0.5 text-gray-500" />
                            <div>
                              <h4 className="font-medium text-sm mb-1">Changes:</h4>
                              <p className="text-sm text-gray-700">{version.changes}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 ml-4">
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>

                      {version.version !== recipe.version && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="outline">
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Activate
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Activate Version {version.version}?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will make version {version.version} the active recipe version.
                                The current version ({recipe.version}) will be archived. This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => onActivateVersion(version.id)}>
                                Activate Version
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}

                      {version.version === recipe.version && (
                        <Button size="sm" variant="outline" disabled>
                          <Archive className="w-4 h-4 mr-1" />
                          Current
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Version Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Version</p>
                <p className="text-2xl font-bold">{recipe.version}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Versions</p>
                <p className="text-2xl font-bold">{versions.length}</p>
              </div>
              <GitBranch className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Archived Versions</p>
                <p className="text-2xl font-bold">{versions.length - 1}</p>
              </div>
              <Archive className="w-8 h-8 text-gray-500" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RecipeVersionControl;