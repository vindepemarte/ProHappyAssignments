import React from 'react';
import { useFormValidation } from '../hooks';
import { assignmentSchema } from '../utils/validation';
import { FormField, LazyFileUpload as FileUpload } from './';

// Example form component to demonstrate validation system
export const ExampleForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useFormValidation(assignmentSchema, {
    accessCode: '',
    fullName: '',
    email: '',
    moduleName: '',
    wordCount: 0,
    orderDeadline: '',
    assignmentFiles: [],
    guidance: '',
  });

  const watchedFiles = watch('assignmentFiles') || [];

  const onSubmit = async (data: any) => {
    console.log('Form submitted:', data);
    // This would normally send data to webhook
  };

  const handleFileChange = (files: File[]) => {
    setValue('assignmentFiles', files, { shouldValidate: true });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <FormField
        label="Access Code"
        name="accessCode"
        type="text"
        placeholder="Enter 5-character access code"
        error={errors.accessCode}
        required
      >
        <input
          {...register('accessCode')}
          type="text"
          placeholder="Enter 5-character access code"
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 transition-colors duration-200 ${
            errors.accessCode
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-[#1d0fdb] focus:ring-[#1d0fdb]'
          }`}
        />
      </FormField>

      <FormField
        label="Full Name"
        name="fullName"
        type="text"
        placeholder="Enter your full name"
        error={errors.fullName}
        required
      >
        <input
          {...register('fullName')}
          type="text"
          placeholder="Enter your full name"
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 transition-colors duration-200 ${
            errors.fullName
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-[#1d0fdb] focus:ring-[#1d0fdb]'
          }`}
        />
      </FormField>

      <FormField
        label="Email"
        name="email"
        type="email"
        placeholder="Enter your email address"
        error={errors.email}
        required
      >
        <input
          {...register('email')}
          type="email"
          placeholder="Enter your email address"
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 transition-colors duration-200 ${
            errors.email
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-[#1d0fdb] focus:ring-[#1d0fdb]'
          }`}
        />
      </FormField>

      <FormField
        label="Module Name"
        name="moduleName"
        type="text"
        placeholder="Enter module name"
        error={errors.moduleName}
        required
      >
        <input
          {...register('moduleName')}
          type="text"
          placeholder="Enter module name"
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 transition-colors duration-200 ${
            errors.moduleName
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-[#1d0fdb] focus:ring-[#1d0fdb]'
          }`}
        />
      </FormField>

      <FormField
        label="Word Count"
        name="wordCount"
        type="number"
        placeholder="Enter word count"
        error={errors.wordCount}
        required
      >
        <input
          {...register('wordCount', { valueAsNumber: true })}
          type="number"
          placeholder="Enter word count"
          min="1"
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 transition-colors duration-200 ${
            errors.wordCount
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-[#1d0fdb] focus:ring-[#1d0fdb]'
          }`}
        />
      </FormField>

      <FormField
        label="Order Deadline"
        name="orderDeadline"
        type="date"
        error={errors.orderDeadline}
        required
      >
        <input
          {...register('orderDeadline')}
          type="date"
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 transition-colors duration-200 ${
            errors.orderDeadline
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-[#1d0fdb] focus:ring-[#1d0fdb]'
          }`}
        />
      </FormField>

      <FileUpload
        label="Assignment Files"
        name="assignmentFiles"
        files={watchedFiles}
        onChange={handleFileChange}
        error={errors.assignmentFiles}
        multiple={true}
        maxFiles={5}
        maxSizeInMB={10}
      />

      <FormField
        label="Guidance"
        name="guidance"
        type="textarea"
        placeholder="Enter any additional guidance or requirements"
        error={errors.guidance}
      >
        <textarea
          {...register('guidance')}
          placeholder="Enter any additional guidance or requirements"
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 transition-colors duration-200 min-h-[100px] resize-vertical ${
            errors.guidance
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-[#1d0fdb] focus:ring-[#1d0fdb]'
          }`}
          rows={4}
        />
      </FormField>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-[#1d0fdb] text-white py-3 px-4 rounded-md hover:bg-[#2f3b65] focus:outline-none focus:ring-2 focus:ring-[#1d0fdb] focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Submitting...' : 'Submit Assignment'}
      </button>
    </form>
  );
};

export default ExampleForm;