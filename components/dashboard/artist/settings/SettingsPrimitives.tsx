"use client";

// Next.js
import { createContext, useContext, useState } from "react";

// CSS
import clsx from "clsx";
import styles from "@/styles/dashboard/artist/settings/Settings.module.css";

// HTML Components
import { Button } from "@/components/ui/button";
import { Loader2, Pencil } from "lucide-react";

// Libs
import { displayToast } from "@/lib/toast";

const EditModeContext = createContext(false);
export const useIsEditing = () => useContext(EditModeContext);

interface EditableCardProps {
  title: string;
  description?: string;
  onSubmit: () => Promise<void>;
  successToast: string;
  errorToast?: string;
  onCancel?: () => void;
  disableSubmit?: boolean;
  children: React.ReactNode;
}

export const EditableCard = ({
  title,
  description,
  onSubmit,
  successToast,
  errorToast = "Couldn't save changes",
  onCancel,
  disableSubmit = false,
  children,
}: EditableCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleCancel = () => {
    onCancel?.();
    setIsEditing(false);
  };

  const handleSubmit = async () => {
    setIsSaving(true);
    try {
      await onSubmit();
      displayToast(successToast, "success");
      setIsEditing(false);
    } catch (err) {
      displayToast(err instanceof Error ? err.message : errorToast, "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.cardHeaderText}>
          <h3 className={styles.cardTitle}>{title}</h3>
          {description && (
            <p className={styles.cardDescription}>{description}</p>
          )}
        </div>
        {!isEditing && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(true)}
          >
            <Pencil size={14} />
            Edit
          </Button>
        )}
      </div>

      <EditModeContext.Provider value={isEditing}>
        <div className={styles.cardBody}>{children}</div>
      </EditModeContext.Provider>

      {isEditing && (
        <div className={styles.cardFooter}>
          <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
            Cancel
          </Button>
          <Button
            className={styles.primaryButton}
            onClick={handleSubmit}
            disabled={isSaving || disableSubmit}
          >
            {isSaving && <Loader2 size={15} className={styles.buttonSpinner} />}
            Save changes
          </Button>
        </div>
      )}
    </section>
  );
};

interface StaticCardProps {
  title: string;
  description?: string;
  headerAction?: React.ReactNode;
  children: React.ReactNode;
}

export const StaticCard = ({
  title,
  description,
  headerAction,
  children,
}: StaticCardProps) => {
  return (
    <section className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.cardHeaderText}>
          <h3 className={styles.cardTitle}>{title}</h3>
          {description && (
            <p className={styles.cardDescription}>{description}</p>
          )}
        </div>
        {headerAction}
      </div>

      <div className={styles.cardBody}>{children}</div>
    </section>
  );
};

interface CardGridProps {
  children: React.ReactNode;
}

export const CardGrid = ({ children }: CardGridProps) => (
  <div className={styles.cardGrid}>{children}</div>
);

interface CardFieldProps {
  label: string;
  value: string;
  children: React.ReactNode;
  full?: boolean;
}

export const CardField = ({ label, value, children, full }: CardFieldProps) => {
  const isEditing = useIsEditing();
  
  return (
    <div
      className={clsx(styles.gridField, {
        [styles.gridFieldFull]: full,
      })}
    >
      <span className={styles.fieldLabel}>{label}</span>
      {isEditing ? children : <FieldValue value={value} />}
    </div>
  );
};

interface CardRowProps {
  label: string;
  description?: string;
  value?: string;
  children: React.ReactNode;
  stacked?: boolean;
  alwaysOn?: boolean;
}

export const CardRow = ({
  label,
  description,
  value = "",
  children,
  stacked = false,
  alwaysOn = false,
}: CardRowProps) => {
  const isEditing = useIsEditing();
  const showControl = alwaysOn || isEditing;

  return (
    <div
      className={clsx(styles.cardRow, {
        [styles.cardRowStacked]: stacked,
      })}
    >
      <div className={styles.rowText}>
        <span className={styles.rowLabel}>{label}</span>
        {description && (
          <span className={styles.rowDescription}>{description}</span>
        )}
      </div>
      <div className={stacked ? styles.controlFull : styles.cardRowControl}>
        {showControl ? children : <FieldValue value={value} />}
      </div>
    </div>
  );
};

const FieldValue = ({ value }: { value: string }) => (
  <span
    className={clsx(styles.fieldValue, {
      [styles.fieldValueMuted]: !value,
    })}
  >
    {value || "—"}
  </span>
);
