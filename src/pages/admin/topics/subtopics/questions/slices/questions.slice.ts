
import { DEFAULT_PAGE_SIZE } from "@/constants/tablePageSizes";
import { QuestionDetails } from "@/models/questions/questionDetails";
import { QuestionOptionDetails } from "@/models/questions/questionOptionDetails";
import { QuestionTypes } from "@/models/questions/questionTypes";
import { SubTopicDetails } from "@/models/subTopic/subTopicDetails";
import { RootState } from "@/store/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type direction = 'asc' | 'desc'
interface QuestionReqParams {
  page_number: number,
  page_size: number,
  sub_topic_id: number | undefined
  title: string | undefined
}

interface FilterTypes {
  sortColumn: string | undefined
  sortDirection: direction
  subtopicFilter: string | undefined
  typeFilter: string | undefined
}

interface QuestionPageSliceState {
  questions : QuestionDetails[]
  filteredQuestions : QuestionDetails[]
  subtopics : SubTopicDetails[]
  questionParams: QuestionReqParams
  totalQuestion: number
  filters: FilterTypes
  delete : {
    questionId : number | undefined ,
    isDeleting : boolean ,
    showDeleteDialog : boolean 
  } ,
  isLoading : boolean
}

const initialState = {
  questions : [] as QuestionDetails[] ,
  filteredQuestions : [] as QuestionDetails[] ,
  subtopics : [] as SubTopicDetails[] ,
  questionParams: {
    page_number: 1,
    page_size: DEFAULT_PAGE_SIZE,
    sub_topic_id: undefined as number | undefined, // selected subtopic
    title: undefined
  },
  totalQuestion: 0,
  filters: {
    sortColumn: undefined as string | undefined,
    sortDirection: 'asc' as direction,
    subtopicFilter: undefined as string | undefined,
    typeFilter: undefined as string | undefined,
  },
  delete : {
    questionId : undefined as number | undefined,
    isDeleting : false ,
    showDeleteDialog : false 
  } ,
  isLoading : false
}

export const QuestionPageSlice = createSlice({
  name: 'QuestionPageSlice',
  initialState,
  reducers: {
    resetQuestionPageSlice: (state: QuestionPageSliceState) => initialState,

    setQuestions: (state: QuestionPageSliceState, action: PayloadAction<QuestionDetails[]>) => {
      state.questions = action.payload ?? []
      state.filteredQuestions = []

    },

    setFilteredQuestions: (state: QuestionPageSliceState, action: PayloadAction<QuestionDetails[]>) => {
      state.filteredQuestions =  action.payload ?? []

    },

    setQuestionSubtopics: (state: QuestionPageSliceState, action: PayloadAction<SubTopicDetails[]>) => {
      state.subtopics = action.payload ?? []
    },

    setQuestionReqParams: (state: QuestionPageSliceState, action: PayloadAction<Partial<QuestionReqParams>>) => {
      state.questionParams = { ...state.questionParams, ...action.payload }
    },

    setQuestionAmount: (state: QuestionPageSliceState, action: PayloadAction<number>) => {
      state.totalQuestion = action.payload
    },

    setQuestionTableFilters: (state: QuestionPageSliceState, action: PayloadAction<Partial<FilterTypes>>) => {
      state.filters = { ...state.filters, ...action.payload }
    },

    setQuestionTableDeleteData: (state: QuestionPageSliceState, action: PayloadAction<{questionId : number | undefined , isDeleting : boolean , showDeleteDialog : boolean}>) => {
      state.delete = action.payload ;
    },

    setQuestionsIsLoading: (state: QuestionPageSliceState, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload ;
    },

     

  }
})

// export reducer to be added in src/store/store.ts
export default QuestionPageSlice.reducer;

// export actions to be called in components
export const {
  resetQuestionPageSlice,
  setQuestionReqParams,
  setQuestions,
  setFilteredQuestions,
  setQuestionSubtopics,
  setQuestionAmount ,
  setQuestionTableFilters ,
  setQuestionTableDeleteData ,
  setQuestionsIsLoading 
} = QuestionPageSlice.actions;

export const getQuestionReqParams = (state: RootState) => state.QuestionPageSlice.questionParams;
export const getQuestions = (state: RootState) => state.QuestionPageSlice.questions;
export const getFilteredQuestions = (state: RootState) => state.QuestionPageSlice.filteredQuestions;
export const getQuestionSubtopics = (state: RootState) => state.QuestionPageSlice.subtopics;
export const getQuestionAmt = (state: RootState) => state.QuestionPageSlice.totalQuestion;
export const getQuestionTableFilters = (state: RootState) => state.QuestionPageSlice.filters;
export const getQuestionTableDeleteData = (state: RootState) => state.QuestionPageSlice.delete;
export const getQuestionsIsLoading = (state: RootState) => state.QuestionPageSlice.isLoading;