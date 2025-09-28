import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Objective, ObjectiveStatus } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { KeyResultItem } from './KeyResultItem';
import { UserCircle, MoreVertical, CheckCircle, XCircle, MessageSquareQuote, Edit, Trash2 } from 'lucide-react';
import { calculateOverallProgress, getObjectiveStatus, STATUS_COLORS } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useOkrStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { DeleteConfirmationDialog } from './DeleteConfirmationDialog';
interface ObjectiveCardProps {
  objective: Objective;
  onEdit?: (objective: Objective) => void;
}
const StatusUpdateSection: React.FC<{ title: string; content?: string }> = ({ title, content }) => {
  if (!content) return null;
  return (
    <div>
      <h4 className="font-semibold text-sm text-kelly-charcoal dark:text-gray-200">{title}</h4>
      <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{content}</p>
    </div>
  );
};
export const ObjectiveCard: React.FC<ObjectiveCardProps> = ({ objective, onEdit }) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { updateObjectiveStatus, deleteObjective } = useOkrStore();
  const overallProgress = calculateOverallProgress(objective);
  const status = getObjectiveStatus(objective);
  const statusColors = STATUS_COLORS[status];
  const handleStatusChange = (newStatus: ObjectiveStatus) => {
    if (objective.id) {
      updateObjectiveStatus(objective.id, newStatus);
    }
  };
  const handleDeleteConfirm = () => {
    if (objective.id) {
      deleteObjective(objective.id);
    }
    setIsDeleteDialogOpen(false);
  };
  const hasStatusUpdates = objective.q2StatusUpdate || objective.q3StatusUpdate || objective.finalStatusUpdate;
  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        <Card
          className={cn(
            "h-full flex flex-col border-gray-200 dark:border-gray-800 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-200 bg-white dark:bg-kelly-charcoal/90 relative",
            `border-l-4 ${statusColors.border}`
          )}
        >
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="flex-1 pr-8">
                <Link to={`/objectives/${objective.id}`} className="hover:underline">
                  <CardTitle className="text-xl font-semibold text-kelly-charcoal dark:text-gray-100">{objective.title}</CardTitle>
                </Link>
                <CardDescription className="pt-1">{objective.description}</CardDescription>
              </div>
              <div className="absolute top-4 right-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                      <MoreVertical size={20} />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {onEdit && (
                      <DropdownMenuItem onClick={() => onEdit(objective)}>
                        <Edit className="mr-2 h-4 w-4" />
                        <span>Quick Edit</span>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={() => handleStatusChange('completed')}>
                      <CheckCircle className="mr-2 h-4 w-4 text-blue-500" />
                      <span>Mark as Completed</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusChange('did-not-meet')}>
                      <XCircle className="mr-2 h-4 w-4 text-gray-500" />
                      <span>Mark as Did Not Meet</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setIsDeleteDialogOpen(true)} className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/50">
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>Delete</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <div className="flex items-center justify-between pt-2">
              <Badge className={cn('capitalize', statusColors.bg, statusColors.text)}>{status.replace('-', ' ')}</Badge>
              <span className="text-lg font-bold text-kelly-green">{Math.round(overallProgress)}%</span>
            </div>
          </CardHeader>
          <CardContent className="flex-grow space-y-4">
            <div>
              <Progress value={overallProgress} className="h-2" />
              <div className="space-y-6 pt-4">
                {objective.keyResults.map((kr) => (
                  <KeyResultItem key={kr.id} keyResult={kr} />
                ))}
              </div>
            </div>
            {hasStatusUpdates && (
              <Accordion type="single" collapsible className="w-full pt-2">
                <AccordionItem value="item-1" className="border-t border-gray-200 dark:border-gray-700">
                  <AccordionTrigger className="text-sm font-medium text-kelly-green hover:no-underline">
                    <div className="flex items-center gap-2">
                      <MessageSquareQuote size={16} />
                      View Status Updates
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-2 space-y-4">
                    <StatusUpdateSection title="Q2 Update" content={objective.q2StatusUpdate} />
                    <StatusUpdateSection title="Q3 Update" content={objective.q3StatusUpdate} />
                    <StatusUpdateSection title="Final Update" content={objective.finalStatusUpdate} />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )}
          </CardContent>
          <CardFooter>
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <UserCircle size={16} />
              <span>{objective.owner}</span>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        objectiveTitle={objective.title}
      />
    </>
  );
};