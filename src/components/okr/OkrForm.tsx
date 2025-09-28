import React, { useEffect } from 'react';
import { useForm, useFieldArray, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Objective } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { PlusCircle, Trash2 } from 'lucide-react';
const numberPreprocess = z.preprocess((val) => {
  const processed = String(val).trim();
  if (processed === '') return null;
  const num = Number(processed);
  return isNaN(num) ? null : num;
}, z.number().nullable().refine(val => val !== null, { message: 'Must be a number' }));
const keyResultSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Title is required'),
  howItIsMeasured: z.string().min(1, 'This field is required'),
  type: z.enum(['PERCENTAGE', 'NUMERIC', 'CURRENCY']),
  startValue: numberPreprocess as z.ZodNumber,
  targetValue: numberPreprocess as z.ZodNumber,
  currentValue: numberPreprocess as z.ZodNumber,
});
const objectiveSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(1, 'Description is required'),
  owner: z.string().min(1, 'Owner is required'),
  whyIsImportant: z.string().optional(),
  q2StatusUpdate: z.string().optional(),
  q3StatusUpdate: z.string().optional(),
  finalStatusUpdate: z.string().optional(),
  keyResults: z.array(keyResultSchema).min(1, 'At least one Key Result is required'),
});
export type ObjectiveFormData = z.infer<typeof objectiveSchema>;
interface OkrFormProps {
  objective?: Objective | null;
  onSubmit: (data: ObjectiveFormData) => void;
  onCancel: () => void;
}
export const OkrForm: React.FC<OkrFormProps> = ({ objective, onSubmit, onCancel }) => {
  const form = useForm<ObjectiveFormData>({
    resolver: zodResolver(objectiveSchema),
    defaultValues: objective || {
      title: '',
      description: '',
      owner: '',
      whyIsImportant: '',
      q2StatusUpdate: '',
      q3StatusUpdate: '',
      finalStatusUpdate: '',
      keyResults: [],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'keyResults',
  });
  useEffect(() => {
    form.reset(objective || {
      title: '',
      description: '',
      owner: '',
      whyIsImportant: '',
      q2StatusUpdate: '',
      q3StatusUpdate: '',
      finalStatusUpdate: '',
      keyResults: [],
    });
  }, [objective, form]);
  const addKeyResult = () => {
    append({
      title: '',
      howItIsMeasured: '',
      type: 'NUMERIC',
      startValue: 0,
      targetValue: 100,
      currentValue: 0,
    });
  };
  const handleFormSubmit: SubmitHandler<ObjectiveFormData> = (data) => {
    onSubmit(data);
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="space-y-4">
          <FormField control={form.control} name="title" render={({ field }) => ( <FormItem> <FormLabel>Objective Title</FormLabel> <FormControl> <Input placeholder="e.g., Launch Q3 Marketing Campaign" {...field} /> </FormControl> <FormMessage /> </FormItem> )}/>
          <FormField control={form.control} name="description" render={({ field }) => ( <FormItem> <FormLabel>Description</FormLabel> <FormControl> <Textarea placeholder="A brief description of the objective" {...field} /> </FormControl> <FormMessage /> </FormItem> )}/>
          <FormField control={form.control} name="owner" render={({ field }) => ( <FormItem> <FormLabel>Owner</FormLabel> <FormControl> <Input placeholder="e.g., Marketing Team" {...field} /> </FormControl> <FormMessage /> </FormItem> )}/>
          <FormField control={form.control} name="whyIsImportant" render={({ field }) => ( <FormItem> <FormLabel>Why this is important</FormLabel> <FormControl> <Textarea placeholder="Explain the strategic value of this objective" {...field} /> </FormControl> <FormMessage /> </FormItem> )}/>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-3">Status Updates</h3>
          <div className="space-y-4 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800/50">
            <FormField control={form.control} name="q2StatusUpdate" render={({ field }) => ( <FormItem> <FormLabel>Q2 Status Update</FormLabel> <FormControl> <Textarea placeholder="Provide a status update for the second quarter..." {...field} /> </FormControl> <FormMessage /> </FormItem> )}/>
            <FormField control={form.control} name="q3StatusUpdate" render={({ field }) => ( <FormItem> <FormLabel>Q3 Status Update</FormLabel> <FormControl> <Textarea placeholder="Provide a status update for the third quarter..." {...field} /> </FormControl> <FormMessage /> </FormItem> )}/>
            <FormField control={form.control} name="finalStatusUpdate" render={({ field }) => ( <FormItem> <FormLabel>Final Status Update</FormLabel> <FormControl> <Textarea placeholder="Provide a final summary of the objective's outcome..." {...field} /> </FormControl> <FormMessage /> </FormItem> )}/>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-3">Key Results</h3>
          <div className="space-y-6">
            {fields.map((field, index) => (
              <div key={field.id} className="p-4 border rounded-lg space-y-4 relative bg-gray-50 dark:bg-gray-800/50">
                <FormField control={form.control} name={`keyResults.${index}.title`} render={({ field }) => ( <FormItem> <FormLabel>KR Title</FormLabel> <FormControl> <Input placeholder="e.g., Increase website traffic" {...field} /> </FormControl> <FormMessage /> </FormItem> )}/>
                <FormField control={form.control} name={`keyResults.${index}.howItIsMeasured`} render={({ field }) => ( <FormItem> <FormLabel>How it's measured</FormLabel> <FormControl> <Textarea placeholder="e.g., Measured by Google Analytics unique visitors." {...field} /> </FormControl> <FormMessage /> </FormItem> )}/>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <FormField control={form.control} name={`keyResults.${index}.type`} render={({ field }) => ( <FormItem> <FormLabel>Type</FormLabel> <Select onValueChange={field.onChange} defaultValue={field.value}> <FormControl> <SelectTrigger> <SelectValue placeholder="Select type" /> </SelectTrigger> </FormControl> <SelectContent> <SelectItem value="NUMERIC">Numeric</SelectItem> <SelectItem value="PERCENTAGE">Percentage</SelectItem> <SelectItem value="CURRENCY">Currency</SelectItem> </SelectContent> </Select> <FormMessage /> </FormItem> )}/>
                  <FormField control={form.control} name={`keyResults.${index}.startValue`} render={({ field }) => ( <FormItem> <FormLabel>Start</FormLabel> <FormControl><Input type="number" {...field} value={field.value ?? ''} /></FormControl> <FormMessage /> </FormItem> )}/>
                  <FormField control={form.control} name={`keyResults.${index}.targetValue`} render={({ field }) => ( <FormItem> <FormLabel>Target</FormLabel> <FormControl><Input type="number" {...field} value={field.value ?? ''} /></FormControl> <FormMessage /> </FormItem> )}/>
                  <FormField control={form.control} name={`keyResults.${index}.currentValue`} render={({ field }) => ( <FormItem> <FormLabel>Current</FormLabel> <FormControl><Input type="number" {...field} value={field.value ?? ''} /></FormControl> <FormMessage /> </FormItem> )}/>
                </div>
                <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2 text-gray-500 hover:text-red-500" onClick={() => remove(index)}> <Trash2 size={16} /> </Button>
              </div>
            ))}
          </div>
          <Button type="button" variant="outline" onClick={addKeyResult} className="mt-4 w-full"> <PlusCircle className="mr-2 h-4 w-4" /> Add Key Result </Button>
        </div>
        <div className="flex justify-end gap-4 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}> Cancel </Button>
          <Button type="submit" className="bg-kelly-green hover:bg-kelly-green/90 text-white"> {objective ? 'Save Changes' : 'Create Objective'} </Button>
        </div>
      </form>
    </Form>
  );
};