import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SubTopicDetails } from "@/models/subTopic/subTopicDetails";
import { SubTopicReqParams } from "@/models/subTopic/subTopicReqParams";

export interface SubTopicPageSliceState {
  subtopics: SubTopicDetails[];
  filteredSubtopics: SubTopicDetails[];
  subtopicReqParams: SubTopicReqParams;
  totalSubTopicAmt: number;
  subtopicTableFilters: {
    sortColumn: string;
    sortDirection: "asc" | "desc";
  };
  subtopicTableDeleteData: {
    subtopicId?: string;
    showDeleteDialog: boolean;
    isDeleting: boolean;
  };
  subtopicsIsLoading: boolean;
}

const initialState: SubTopicPageSliceState = {
  subtopics: [],
  filteredSubtopics: [],
  subtopicReqParams: {
    page_number: 1,
    page_size: 10,
  },
  totalSubTopicAmt: 0,
  subtopicTableFilters: {
    sortColumn: "name",
    sortDirection: "asc",
  },
  subtopicTableDeleteData: {
    subtopicId: undefined,
    showDeleteDialog: false,
    isDeleting: false,
  },
  subtopicsIsLoading: false,
};

const SubTopicPageSlice = createSlice({
  name: "SubTopicPageSlice",
  initialState,
  reducers: {
    setSubTopics: (state, action: PayloadAction<SubTopicDetails[]>) => {
      state.subtopics = action.payload;
    },
    setFilteredSubTopics: (state, action: PayloadAction<SubTopicDetails[]>) => {
      state.filteredSubtopics = action.payload;
    },
    setSubTopicReqParams: (
      state,
      action: PayloadAction<Partial<SubTopicReqParams>>
    ) => {
      state.subtopicReqParams = {
        ...state.subtopicReqParams,
        ...action.payload,
      };
    },
    setSubTopicAmount: (state, action: PayloadAction<number>) => {
      state.totalSubTopicAmt = action.payload;
    },
    setSubTopicTableFilters: (
      state,
      action: PayloadAction<
        Partial<SubTopicPageSliceState["subtopicTableFilters"]>
      >
    ) => {
      state.subtopicTableFilters = {
        ...state.subtopicTableFilters,
        ...action.payload,
      };
    },
    setSubTopicTableDeleteData: (
      state,
      action: PayloadAction<
        Partial<SubTopicPageSliceState["subtopicTableDeleteData"]>
      >
    ) => {
      state.subtopicTableDeleteData = {
        ...state.subtopicTableDeleteData,
        ...action.payload,
      };
    },
    setSubTopicsIsLoading: (state, action: PayloadAction<boolean>) => {
      state.subtopicsIsLoading = action.payload;
    },
  },
});

export const {
  setSubTopics,
  setFilteredSubTopics,
  setSubTopicReqParams,
  setSubTopicAmount,
  setSubTopicTableFilters,
  setSubTopicTableDeleteData,
  setSubTopicsIsLoading,
} = SubTopicPageSlice.actions;

// Selectors
export const getSubTopics = (state: {
  SubTopicPageSlice: SubTopicPageSliceState;
}) => state.SubTopicPageSlice.subtopics;

export const getFilteredSubTopics = (state: {
  SubTopicPageSlice: SubTopicPageSliceState;
}) => state.SubTopicPageSlice.filteredSubtopics;

export const getSubTopicReqParams = (state: {
  SubTopicPageSlice: SubTopicPageSliceState;
}) => state.SubTopicPageSlice.subtopicReqParams;

export const getSubTopicAmt = (state: {
  SubTopicPageSlice: SubTopicPageSliceState;
}) => state.SubTopicPageSlice.totalSubTopicAmt;

export const getSubTopicTableFilters = (state: {
  SubTopicPageSlice: SubTopicPageSliceState;
}) => state.SubTopicPageSlice.subtopicTableFilters;

export const getSubTopicTableDeleteData = (state: {
  SubTopicPageSlice: SubTopicPageSliceState;
}) => state.SubTopicPageSlice.subtopicTableDeleteData;

export const getSubTopicsIsLoading = (state: {
  SubTopicPageSlice: SubTopicPageSliceState;
}) => state.SubTopicPageSlice.subtopicsIsLoading;

export default SubTopicPageSlice.reducer;
