import React, { useState, useMemo, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useOkrStore } from '@/lib/store';
import { ObjectiveCard } from '@/components/okr/ObjectiveCard';
import { OkrForm, ObjectiveFormData } from '@/components/okr/OkrForm';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Objective } from '@/types';
import { Plus, Target } from 'lucide-react';
import { DashboardFilters } from '@/components/okr/DashboardFilters';
import { OkrStatusChart } from '@/components/okr/OkrStatusChart';
import { getObjectiveStatus } from '@/lib/utils';
import { ObjectiveCardSkeleton } from '@/components/okr/ObjectiveCardSkeleton';
const KingpinLogo = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-kelly-green">
    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
export function HomePage() {
  const { okrs, ownerFilter, statusFilter, loading, fetchOkrs, addObjective, updateObjective } = useOkrStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingObjective, setEditingObjective] = useState<Objective | null>(null);
  useEffect(() => {
    fetchOkrs();
  }, [fetchOkrs]);
  const filteredOkrs = useMemo(() => {
    return okrs
      .filter(okr => ownerFilter === 'all' || okr.owner === ownerFilter)
      .filter(okr => {
        if (statusFilter === 'all') return true;
        return getObjectiveStatus(okr) === statusFilter;
      });
  }, [okrs, ownerFilter, statusFilter]);
  const handleAddObjectiveClick = () => {
    setEditingObjective(null);
    setIsModalOpen(true);
  };
  const handleEditObjectiveClick = (objective: Objective) => {
    setEditingObjective(objective);
    setIsModalOpen(true);
  };
  const handleFormSubmit = async (data: ObjectiveFormData) => {
    if (editingObjective) {
      await updateObjective({
        ...editingObjective,
        ...data,
        keyResults: data.keyResults,
      });
    } else {
      await addObjective({
        ...data,
        keyResults: data.keyResults.map(({ id, ...rest }) => rest),
      });
    }
    setIsModalOpen(false);
    setEditingObjective(null);
  };
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-kelly-charcoal/95">
      <header className="bg-white dark:bg-kelly-charcoal/90 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <KingpinLogo />
              <h1 className="text-2xl font-bold text-kelly-charcoal dark:text-white">Kingpin</h1>
            </div>
            <Button onClick={handleAddObjectiveClick} className="bg-kelly-green hover:bg-kelly-green/90 text-white">
              <Plus className="mr-2 h-4 w-4" />
              Add Objective
            </Button>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <OkrStatusChart />
          <DashboardFilters />
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence>
              {loading ? (
                Array.from({ length: 3 }).map((_, index) => <ObjectiveCardSkeleton key={index} />)
              ) : filteredOkrs.length > 0 ? (
                filteredOkrs.map((objective) => (
                  <ObjectiveCard
                    key={objective.id}
                    objective={objective}
                    onEdit={handleEditObjectiveClick}
                  />
                ))
              ) : null}
            </AnimatePresence>
          </motion.div>
          {!loading && filteredOkrs.length === 0 && (
            <div className="text-center py-16 bg-white dark:bg-kelly-charcoal/90 rounded-lg shadow-sm border border-dashed">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-kelly-green/10">
                <Target className="h-6 w-6 text-kelly-green" />
              </div>
              <h3 className="mt-5 text-xl font-semibold text-gray-800 dark:text-gray-200">No Objectives Found</h3>
              <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
                Try adjusting your filters or create a new objective to get started.
              </p>
              <div className="mt-6">
                <Button onClick={handleAddObjectiveClick} className="bg-kelly-green hover:bg-kelly-green/90 text-white">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Objective
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
      <footer className="text-center py-8 text-gray-500 dark:text-gray-400 text-sm">
        <p>Built with ❤️ at Cloudflare</p>
      </footer>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {editingObjective ? 'Edit Objective' : 'Create New Objective'}
            </DialogTitle>
            <DialogDescription>
              {editingObjective ? 'Update the details of your objective and key results.' : 'Define your new objective and its measurable key results.'}
            </DialogDescription>
          </DialogHeader>
          <OkrForm
            objective={editingObjective}
            onSubmit={handleFormSubmit}
            onCancel={() => setIsModalOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}