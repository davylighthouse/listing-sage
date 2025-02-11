
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { GripVertical } from "lucide-react";
import { MetricName, MetricPriority } from "@/types/metrics";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const defaultPriorities: Array<{ metric: MetricName; priority: number }> = [
  { metric: 'quantity_sold', priority: 1 },
  { metric: 'sales_conversion_rate', priority: 2 },
  { metric: 'click_through_rate', priority: 3 },
  { metric: 'total_impressions_ebay', priority: 4 },
  { metric: 'top_20_search_slot_organic_impressions', priority: 5 },
  { metric: 'total_page_views', priority: 6 },
  { metric: 'top_20_search_slot_promoted_impressions', priority: 7 },
  { metric: 'change_top_20_search_slot_impressions', priority: 8 },
  { metric: 'total_promoted_listings_impressions', priority: 9 },
  { metric: 'page_views_promoted_ebay', priority: 10 },
  { metric: 'page_views_organic_ebay', priority: 11 },
  { metric: 'change_top_20_search_slot_promoted_impressions', priority: 12 },
  { metric: 'page_views_promoted_outside_ebay', priority: 13 },
  { metric: 'page_views_organic_outside_ebay', priority: 14 },
  { metric: 'total_organic_impressions_ebay', priority: 15 },
  { metric: 'non_search_promoted_listings_impressions', priority: 16 },
  { metric: 'change_non_search_promoted_listings_impressions', priority: 17 },
  { metric: 'rest_of_search_slot_impressions', priority: 18 },
  { metric: 'non_search_organic_impressions', priority: 19 },
  { metric: 'change_non_search_organic_impressions', priority: 20 }
];

const formatMetricName = (metric: string) => {
  return metric
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

interface SortableItemProps {
  id: string;
  metric: string;
  index: number;
}

const SortableItem = ({ id, metric, index }: SortableItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-4 p-3 bg-white border rounded-lg shadow-sm"
    >
      <div {...attributes} {...listeners}>
        <GripVertical className="text-gray-400 cursor-grab active:cursor-grabbing" />
      </div>
      <span className="font-medium min-w-[24px]">{index + 1}.</span>
      <span className="flex-1">{formatMetricName(metric)}</span>
    </div>
  );
};

export const MetricPriorities = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const { data: metricPriorities, isLoading } = useQuery({
    queryKey: ['metric-priorities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('metric_priorities')
        .select('*')
        .order('priority');

      if (error) {
        throw error;
      }

      return data as MetricPriority[];
    },
  });

  const updatePrioritiesMutation = useMutation({
    mutationFn: async (updatedPriorities: MetricPriority[]) => {
      if (!user?.id) return;

      const { error } = await supabase
        .from('metric_priorities')
        .upsert(
          updatedPriorities.map((p, index) => ({
            id: p.id,
            metric: p.metric,
            priority: index + 1,
            weight: p.weight,
            user_id: p.user_id
          }))
        );

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['metric-priorities'] });
      toast({
        title: "Success",
        description: "Metric priorities have been updated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update metric priorities.",
        variant: "destructive",
      });
      console.error('Error updating priorities:', error);
    }
  });

  const initializePrioritiesMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id) return;

      const { error } = await supabase
        .from('metric_priorities')
        .insert(
          defaultPriorities.map(p => ({
            metric: p.metric,
            priority: p.priority,
            user_id: user.id,
            weight: 1.0
          }))
        );

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['metric-priorities'] });
      toast({
        title: "Success",
        description: "Default metric priorities have been initialized.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to initialize metric priorities.",
        variant: "destructive",
      });
      console.error('Error initializing priorities:', error);
    }
  });

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id && metricPriorities) {
      const oldIndex = metricPriorities.findIndex((p) => p.id === active.id);
      const newIndex = metricPriorities.findIndex((p) => p.id === over.id);

      const newPriorities = arrayMove(metricPriorities, oldIndex, newIndex);
      updatePrioritiesMutation.mutate(newPriorities);
    }
  };

  const handleInitialize = () => {
    initializePrioritiesMutation.mutate();
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!metricPriorities || metricPriorities.length === 0) {
    return (
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Metric Priorities</h2>
        <p className="mb-4">No metric priorities have been set. Would you like to initialize them with default values?</p>
        <Button onClick={handleInitialize}>Initialize Default Priorities</Button>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Metric Priorities</h2>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={metricPriorities.map(p => p.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
            {metricPriorities.map((priority, index) => (
              <SortableItem
                key={priority.id}
                id={priority.id}
                metric={priority.metric}
                index={index}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </Card>
  );
};
