"use client";

// CSS
import ob from "@/styles/onboarding/Onboarding.module.css";
import bk from "@/styles/book/BookingFlow.module.css";

// HTML Components
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// Libs
import type {
  BookingFlowFormState,
  UpdateBookingForm,
} from "@/types/bookingFlow";

interface CustomQuestionsPhaseProps {
  form: BookingFlowFormState;
  update: UpdateBookingForm;
  questions: string[];
}

export const CustomQuestionsPhase = ({
  form,
  update,
  questions,
}: CustomQuestionsPhaseProps) => {
  return (
    <>
      {questions.map((question, index) => (
        <div className={ob.field} key={index}>
          <Label htmlFor={`ob-question-${index}`}>{question}</Label>
          <Textarea
            id={`ob-question-${index}`}
            className={bk.textarea}
            value={form.answers[question] ?? ""}
            onChange={(e) =>
              update({
                answers: { ...form.answers, [question]: e.target.value },
              })
            }
          />
        </div>
      ))}
    </>
  );
};
