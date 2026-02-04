'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Save,
  Share2,
  FileText,
  Trash2,
  Download,
  Copy,
  Check,
} from 'lucide-react';
import useShowroomStore from '@/lib/showroomStore';
import { formatRange } from '@/lib/format';
import { useToast } from '@/hooks/use-toast';

export default function VersionManager() {
  const { savedVersions, saveVersion, loadVersion, deleteVersion, estimate } =
    useShowroomStore();
  const { toast } = useToast();
  const [versionName, setVersionName] = useState('');
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [proposalDialogOpen, setProposalDialogOpen] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const handleSaveVersion = () => {
    if (!versionName.trim()) {
      const defaultName = `Version ${savedVersions.length + 1}`;
      saveVersion(defaultName);
      toast({
        title: 'Version saved',
        description: `Saved as "${defaultName}"`,
      });
    } else {
      saveVersion(versionName);
      toast({
        title: 'Version saved',
        description: `Saved as "${versionName}"`,
      });
      setVersionName('');
    }
  };

  const handleShareLink = () => {
    const mockShareUrl = `https://norton-remodeling.com/showroom/share/${Date.now()}`;
    navigator.clipboard.writeText(mockShareUrl);
    setLinkCopied(true);
    toast({
      title: 'Link copied',
      description: 'Share link copied to clipboard',
    });
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const handleDeleteVersion = (versionId: string) => {
    if (confirm('Delete this version?')) {
      deleteVersion(versionId);
      toast({
        title: 'Version deleted',
        description: 'Version removed from your saved list',
      });
    }
  };

  return (
    <div className="border-t border-gray-200 p-4 space-y-3">
      <div className="flex gap-2">
        <Input
          placeholder="Version name (optional)"
          value={versionName}
          onChange={(e) => setVersionName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSaveVersion();
            }
          }}
        />
        <Button onClick={handleSaveVersion} size="icon" variant="default">
          <Save className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex gap-2">
        <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex-1">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Share Your Design</DialogTitle>
              <DialogDescription>
                Generate a link to share this design with others
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">
                  Share link includes your selections and pricing
                </p>
                <code className="text-xs bg-white p-2 rounded block overflow-x-auto">
                  norton-remodeling.com/showroom/share/...
                </code>
              </div>
              <Button onClick={handleShareLink} className="w-full">
                {linkCopied ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Link
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={proposalDialogOpen} onOpenChange={setProposalDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex-1">
              <FileText className="h-4 w-4 mr-2" />
              Proposal
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Proposal Preview</DialogTitle>
              <DialogDescription>
                Your custom kitchen remodel proposal
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 mt-4">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Norton Home Remodeling
                </h2>
                <p className="text-gray-600">Kitchen Remodel Proposal</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">
                  Estimated Investment
                </h3>
                <p className="text-3xl font-bold text-gray-900">
                  {formatRange(estimate.totalLow, estimate.totalHigh)}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Timeline: {estimate.timelineLow}–{estimate.timelineHigh} weeks
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Your Selections</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Cabinets:</span>
                    <span className="font-medium">
                      {useShowroomStore.getState().settings.materials.cabinetMaterial}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Countertops:</span>
                    <span className="font-medium">
                      {useShowroomStore.getState().settings.materials.countertopMaterial}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Backsplash:</span>
                    <span className="font-medium">
                      {useShowroomStore.getState().settings.materials.backsplashMaterial}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Flooring:</span>
                    <span className="font-medium">
                      {useShowroomStore.getState().settings.materials.flooringMaterial}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Hardware:</span>
                    <span className="font-medium">
                      {useShowroomStore.getState().settings.materials.hardwareMaterial}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 text-sm text-blue-900">
                <strong>Next Steps:</strong>
                <ol className="list-decimal list-inside mt-2 space-y-1">
                  <li>Schedule free in-home consultation</li>
                  <li>Finalize measurements and site review</li>
                  <li>Receive detailed proposal</li>
                  <li>Begin your transformation</li>
                </ol>
              </div>

              <Button className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {savedVersions.length > 0 && (
        <div className="space-y-2">
          <div className="text-xs font-medium text-gray-600">Saved Versions</div>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {savedVersions.map((version) => (
              <div
                key={version.id}
                className="flex items-center justify-between p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <button
                  onClick={() => loadVersion(version.id)}
                  className="flex-1 text-left"
                >
                  <div className="text-sm font-medium text-gray-900">
                    {version.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatRange(version.estimate.totalLow, version.estimate.totalHigh)}
                  </div>
                </button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => handleDeleteVersion(version.id)}
                  className="h-8 w-8"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
