import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useOkrStore } from '@/lib/store';
import { Objective } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { KeyResultItem } from '@/components/okr/KeyResultItem';
import { OkrForm, ObjectiveFormData } from '@/components/okr/OkrForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { calculateOverallProgress, getObjectiveStatus, STATUS_COLORS } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { ArrowLeft, Edit, UserCircle, Info, MessageSquareQuote, Trash2 } from 'lucide-react';
import { DeleteConfirmationDialog } from '@/components/okr/DeleteConfirmationDialog';
import { ObjectiveDetailSkeleton } from '@/components/okr/ObjectiveDetailSkeleton';
const KingpinLogo = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-kelly-green">
    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const StatusUpdateSection: React.FC<{ title: string; content?: string }> = ({ title, content }) => {
  if (!content) return null;
  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
      <h4 className="font-semibold text-sm text-kelly-charcoal dark:text-gray-200">{title}</h4>
      <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap mt-1">{content}</p>
    </div>
  );
};
export function ObjectiveDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getObjectiveById, updateObjective, deleteObjective, fetchOkrs, okrs, loading } = useOkrStore();
  const [objective, setObjective] = useState<Objective | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  useEffect(() => {
    if (okrs.length === 0 && !loading) {
      fetchOkrs();
    }
  }, [okrs.length, loading, fetchOkrs]);
  useEffect(() => {
    if (id) {
      const foundObjective = getObjectiveById(id);
      if (foundObjective) {
        setObjective(foundObjective);
      }
    }
  }, [id, getObjectiveById, okrs]);
  const handleFormSubmit = async (data: ObjectiveFormData) => {
    if (objective) {
      await updateObjective({
        ...objective,
        ...data,
        keyResults: data.keyResults,
      });
    }
    setIsModalOpen(false);
  };
  const handleDeleteConfirm = async () => {
    if (objective?.id) {
      await deleteObjective(objective.id);
      setIsDeleteDialogOpen(false);
      navigate('/');
    }
  };
  const pageContent = () => {
    if (loading && !objective) {
      return <ObjectiveDetailSkeleton />;
    }
    if (!objective) {
      return (
        <div className="text-center py-16">
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">Objective Not Found</h3>
          <p className="text-gray-500 dark:text-gray-400 mt-2">The objective you are looking for does not exist or has been deleted.</p>
        </div>
      );
    }
    const overallProgress = calculateOverallProgress(objective);
    const status = getObjectiveStatus(objective);
    const statusColors = STATUS_COLORS[status];
    return (
      <Card className={cn("w-full border-gray-200 dark:border-gray-800 shadow-lg bg-white dark:bg-kelly-charcoal/90", `border-l-4 ${statusColors.border}`)}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Badge className={cn('capitalize', statusColors.bg, statusColors.text)}>{status.replace('-', ' ')}</Badge>
            <span className="text-2xl font-bold text-kelly-green">{Math.round(overallProgress)}%</span>
          </div>
          <CardTitle className="text-3xl font-bold text-kelly-charcoal dark:text-gray-100 pt-4">{objective.title}</CardTitle>
          <CardDescription className="pt-1 text-base">{objective.description}</CardDescription>
          <Progress value={overallProgress} className="h-2 mt-4" />
        </CardHeader>
        <CardContent className="space-y-8">
          {objective.whyIsImportant && (
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400 rounded-r-lg">
              <h3 className="flex items-center text-lg font-semibold text-kelly-charcoal dark:text-gray-200 mb-2">
                <Info className="mr-2 h-5 w-5 text-blue-500" />
                Why This Is Important
              </h3>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{objective.whyIsImportant}</p>
            </div>
          )}
          <div>
            <h3 className="text-xl font-semibold text-kelly-charcoal dark:text-gray-200 mb-4">Key Results</h3>
            <div className="space-y-6">
              {objective.keyResults.map((kr) => (
                <KeyResultItem key={kr.id} keyResult={kr} />
              ))}
            </div>
          </div>
          {(objective.q2StatusUpdate || objective.q3StatusUpdate || objective.finalStatusUpdate) && (
            <div>
              <h3 className="flex items-center text-xl font-semibold text-kelly-charcoal dark:text-gray-200 mb-4">
                <MessageSquareQuote className="mr-2 h-5 w-5" />
                Status Updates
              </h3>
              <div className="space-y-4">
                <StatusUpdateSection title="Q2 Update" content={objective.q2StatusUpdate} />
                <StatusUpdateSection title="Q3 Update" content={objective.q3StatusUpdate} />
                <StatusUpdateSection title="Final Update" content={objective.finalStatusUpdate} />
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <UserCircle size={16} />
            <span>{objective.owner}</span>
          </div>
        </CardFooter>
      </Card>
    );
  };
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-kelly-charcoal/95">
      <header className="bg-white dark:bg-kelly-charcoal/90 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="flex items-center gap-3">
              <KingpinLogo />
              <h1 className="text-2xl font-bold text-kelly-charcoal dark:text-white">Kingpin</h1>
            </Link>
            <div className="flex items-center gap-2">
              <Button onClick={() => setIsModalOpen(true)} className="bg-kelly-green hover:bg-kelly-green/90 text-white">
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
              <Button variant="destructive" onClick={() => setIsDeleteDialogOpen(true)}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-8">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
        {pageContent()}
      </main>
      <footer className="text-center py-8 text-gray-500 dark:text-gray-400 text-sm">
        <p>Built with ❤️ at Cloudflare</p>
      </footer>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Edit Objective</DialogTitle>
            <DialogDescription>Update the details of your objective and key results.</DialogDescription>
          </DialogHeader>
          <OkrForm
            objective={objective}
            onSubmit={handleFormSubmit}
            onCancel={() => setIsModalOpen(false)}
          />
        </DialogContent>
      </Dialog>
      {objective && (
        <DeleteConfirmationDialog
          isOpen={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          onConfirm={handleDeleteConfirm}
          objectiveTitle={objective.title}
        />
      )}
    </div>
  );
}