import React from "react";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

interface StepActionsProps {
  /** Called when Back is clicked (navigates to previous step) */
  onBack?: () => void;
  /** Label for the primary action button. Defaults to "Save & Continue" */
  primaryLabel?: string;
  /** Whether primary button is in loading state */
  isLoading?: boolean;
  /** Whether primary button is disabled */
  disabled?: boolean;
  /** If true, primary is type="button" with onClick; otherwise type="submit" */
  onPrimary?: () => void;
  /** Show right-side chevron on primary button */
  showPrimaryChevron?: boolean;
  /** Custom content to the right of Back, left of primary */
  centerSlot?: React.ReactNode;
}

/**
 * Canonical step footer with Back ← and primary → action buttons.
 * Used identically across all 9 form steps.
 */
export function StepActions({
  onBack,
  primaryLabel = "Save & Continue",
  isLoading = false,
  disabled = false,
  onPrimary,
  showPrimaryChevron = true,
  centerSlot,
}: StepActionsProps) {
  return (
    <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-6"> {/* mt-6 = 24px per rule 6 */}
      {/* Back button */}
      {onBack ? (
        <button
          type="button"
          onClick={onBack}
          className="gov-btn-secondary"
          aria-label="Go to previous step"
        >
          <ChevronLeft size={16} aria-hidden="true" />
          Back
        </button>
      ) : (
        /* Placeholder to keep primary right-aligned when no back */
        <div />
      )}

      {centerSlot}

      {/* Primary action */}
      {onPrimary ? (
        <button
          type="button"
          onClick={onPrimary}
          disabled={isLoading || disabled}
          className="gov-btn-primary"
          aria-label={primaryLabel}
        >
          {isLoading ? (
            <Loader2 size={16} className="animate-spin" aria-hidden="true" />
          ) : null}
          {primaryLabel}
          {showPrimaryChevron && !isLoading && (
            <ChevronRight size={16} aria-hidden="true" />
          )}
        </button>
      ) : (
        <button
          type="submit"
          disabled={isLoading || disabled}
          className="gov-btn-primary"
        >
          {isLoading ? (
            <Loader2 size={16} className="animate-spin" aria-hidden="true" />
          ) : null}
          {primaryLabel}
          {showPrimaryChevron && !isLoading && (
            <ChevronRight size={16} aria-hidden="true" />
          )}
        </button>
      )}
    </div>
  );
}
