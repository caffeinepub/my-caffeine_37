import { useState } from 'react';

/**
 * Hook to manage single-confirmation submit flow with duplicate-write prevention
 * Usage:
 *   const { isSaving, showConfirm, setShowConfirm, handleSubmit } = useSingleConfirmSubmit(async () => { ... });
 *   <Button onClick={() => setShowConfirm(true)} disabled={isSaving}>Submit</Button>
 *   <ConfirmDialog open={showConfirm} onConfirm={handleSubmit} ... />
 */
export function useSingleConfirmSubmit(onConfirm: () => Promise<void> | void) {
  const [isSaving, setIsSaving] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = async () => {
    if (isSaving) return; // Guard against duplicate calls
    
    setIsSaving(true);
    setShowConfirm(false);
    
    try {
      await onConfirm();
    } finally {
      setIsSaving(false);
    }
  };

  return {
    isSaving,
    showConfirm,
    setShowConfirm,
    handleSubmit,
  };
}
