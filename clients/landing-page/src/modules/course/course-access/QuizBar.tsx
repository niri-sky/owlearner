import { useCouseAccessData } from "@/shared/context/CourseAccessProvider";
import { useStudentData } from "@/shared/context/StudentDataProvider";
import useUserData from "@/shared/hooks/useUserData";
import { QuizItemType } from "@/shared/utils/types";
import { Spinner } from "@nextui-org/react";
import React, { useMemo, useState } from "react";

function QuizBar() {
  const { userData } = useUserData();
  const { activeContentData, updateStudentCourse, studentCourse } =
    useCouseAccessData();

  const [selected, setSelected] = useState<
    {
      quizId: string;
      select: number;
    }[]
  >([]);

  const { quizzes, selectedQuiz } = useMemo(() => {
    const quizzes = activeContentData.quizzes || [];

    const selectedQuiz = activeContentData?.studentQuizPoint?.find(
      (v) =>
        String(v?.courseContentId) == String(activeContentData?.id) &&
        String(v?.studentCourseId) == String(studentCourse?.id)
    );

    console.log("Selected Quiz", selectedQuiz);

    return { quizzes, selectedQuiz };
  }, [activeContentData, studentCourse]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async () => {
    if (quizzes.length != selected.length) {
      return setError("Please answers all questions");
    }
    if (loading) return;
    try {
      setLoading(true);
      let correct = 0;
      for (const quiz of quizzes) {
        const selectQuiz = selected.find((v) => v.quizId == quiz.id);
        if (selectQuiz?.select == Number(quiz.answer)) {
          correct++;
        }
      }

      console.log(correct, selected);
      await updateStudentCourse({
        quiz_points: {
          create: {
            total_quiz: quizzes.length,
            correct,
            points: correct,
            courseContent: {
              connect: { id: Number(activeContentData?.id) },
            },
          },
        },
      });

      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  if (selectedQuiz)
    return (
      <div className="py-6">
        You already answered to this quiz. Your score is {selectedQuiz?.points}
      </div>
    );

  return quizzes.length > 0 ? (
    <div>
      <div className="pt-6"></div>
      <div>
        <div className="flex flex-col gap-10">
          {quizzes?.map((v, i) => (
            <QuizItem
              key={"dgd" + i}
              item={v}
              index={i + 1}
              optionSelect={selected.find((f) => f.quizId == v.id)?.select}
              onClick={(opt) => {
                setSelected((s) => {
                  const findQuiz = s.find((f) => f.quizId == v.id);
                  if (findQuiz) {
                    return s.map((ss) => {
                      if (ss.quizId == v.id) {
                        ss.select = opt;
                      }
                      return ss;
                    });
                  } else {
                    return [
                      ...s,
                      {
                        quizId: v.id,
                        select: opt,
                      },
                    ];
                  }
                });
              }}
            />
          ))}
        </div>
      </div>
      <div className="pt-10"></div>
      <div className="flex justify-end items-center gap-5">
        {error && <div className="text-red-500 ">{error}</div>}
        <button
          disabled={loading}
          onClick={onSubmit}
          className="h-[58px] font-lg font-bold font-dmsans min-w-[159px] flex items-center justify-center disabled:opacity-80 gap-2 text-[#fff] bg-primary rounded-full "
        >
          {loading ? (
            <>
              <Spinner size="sm" color="default" /> Loading...
            </>
          ) : (
            "Submit"
          )}
        </button>
      </div>
    </div>
  ) : (
    <div className="py-6">Quiz not found</div>
  );
}

type QuizItemProps = {
  item: Quiz;
  index: number;
  onClick: (opt: number) => any;
  optionSelect?: number;
};

function QuizItem({ item, index, onClick, optionSelect }: QuizItemProps) {
  return (
    <div>
      <div className="text-[20px] leading-[28px] font-medium font-dmsans">
        {index}. {item.title}
      </div>
      <div className="pt-[32px]"></div>
      <div className="flex flex-col gap-4">
        {item?.options?.map((v, i) => (
          <div
            key={"dgs" + i}
            aria-selected={optionSelect == i}
            onClick={() => onClick(i)}
            className="text-base bg-[#fff] cursor-pointer hover:bg-[#FFEEE8] shadow-[0px_0px_16px_0px_#0000000F] font-dmsans leading-[24px] p-[16px_24px] rounded-full aria-selected:bg-primary aria-selected:text-[#fff]"
          >
            {v}
          </div>
        ))}
      </div>
    </div>
  );
}

export default QuizBar;
