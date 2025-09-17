import { DEFAULT_PAGE_SIZE } from "@/constants/tablePageSizes";
import { TopicDetails } from "@/models/topics/topicDetails";
import { RootState } from "@/store/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type direction = "asc" | "desc";

interface TopicReqParams {
  page_number: number;
  page_size: number;
  title?: string;
}

interface FilterTypes {
  sortColumn: string | undefined;
  sortDirection: direction;
}

interface TopicPageSliceState {
  topics: TopicDetails[];
  filteredTopics: TopicDetails[];
  topicParams: TopicReqParams;
  totalTopics: number;
  filters: FilterTypes;
  delete: {
    topicId: string | undefined;
    isDeleting: boolean;
    showDeleteDialog: boolean;
  };
  isLoading: boolean;
  isLoadingFormData: boolean;
  topicFormData: TopicDetails;
}

const initialState: TopicPageSliceState = {
  topics: [] as TopicDetails[],
  filteredTopics: [] as TopicDetails[],
  topicParams: {
    page_number: 1,
    page_size: DEFAULT_PAGE_SIZE,
    title: undefined,
  },
  totalTopics: 0,
  filters: {
    sortColumn: "name",
    sortDirection: "asc" as direction,
  },
  delete: {
    topicId: undefined as string | undefined,
    isDeleting: false,
    showDeleteDialog: false,
  },
  isLoading: false,
  isLoadingFormData: false,
  topicFormData: {
    name: "",
    description: "",
  },
};

export const TopicPageSlice = createSlice({
  name: "TopicPageSlice",
  initialState,
  reducers: {
    resetTopicPageSlice: (state: TopicPageSliceState) => initialState,

    setTopics: (
      state: TopicPageSliceState,
      action: PayloadAction<TopicDetails[]>
    ) => {
      state.topics = action.payload ?? [];
      state.filteredTopics = [];
    },

    setFilteredTopics: (
      state: TopicPageSliceState,
      action: PayloadAction<TopicDetails[]>
    ) => {
      state.filteredTopics = action.payload ?? [];
    },

    setTopicReqParams: (
      state: TopicPageSliceState,
      action: PayloadAction<Partial<TopicReqParams>>
    ) => {
      state.topicParams = { ...state.topicParams, ...action.payload };
    },

    setTopicAmount: (
      state: TopicPageSliceState,
      action: PayloadAction<number>
    ) => {
      state.totalTopics = action.payload;
    },

    setTopicTableFilters: (
      state: TopicPageSliceState,
      action: PayloadAction<Partial<FilterTypes>>
    ) => {
      state.filters = { ...state.filters, ...action.payload };
    },

    setTopicTableDeleteData: (
      state: TopicPageSliceState,
      action: PayloadAction<{
        topicId: string | undefined;
        isDeleting: boolean;
        showDeleteDialog: boolean;
      }>
    ) => {
      state.delete = action.payload;
    },

    setTopicsIsLoading: (
      state: TopicPageSliceState,
      action: PayloadAction<boolean>
    ) => {
      state.isLoading = action.payload;
    },

    setTopicFormIsLoading: (
      state: TopicPageSliceState,
      action: PayloadAction<boolean>
    ) => {
      state.isLoadingFormData = action.payload;
    },

    setTopicFormData: (
      state: TopicPageSliceState,
      action: PayloadAction<{ field: keyof TopicDetails; value: any }>
    ) => {
      state.topicFormData = {
        ...state.topicFormData,
        [action.payload.field]: action.payload.value,
      };
    },

    setAllTopicFormData: (
      state: TopicPageSliceState,
      action: PayloadAction<TopicDetails>
    ) => {
      state.topicFormData = { ...action.payload };
    },
  },
});

export default TopicPageSlice.reducer;

export const {
  resetTopicPageSlice,
  setTopicReqParams,
  setTopics,
  setFilteredTopics,
  setTopicAmount,
  setTopicTableFilters,
  setTopicTableDeleteData,
  setTopicsIsLoading,
  setTopicFormIsLoading,
  setAllTopicFormData,
  setTopicFormData,
} = TopicPageSlice.actions;

export const getTopicReqParams = (state: RootState) =>
  state.TopicPageSlice.topicParams;
export const getTopics = (state: RootState) => state.TopicPageSlice.topics;
export const getFilteredTopics = (state: RootState) =>
  state.TopicPageSlice.filteredTopics;
export const getTopicAmt = (state: RootState) =>
  state.TopicPageSlice.totalTopics;
export const getTopicTableFilters = (state: RootState) =>
  state.TopicPageSlice.filters;
export const getTopicTableDeleteData = (state: RootState) =>
  state.TopicPageSlice.delete;
export const getTopicsIsLoading = (state: RootState) =>
  state.TopicPageSlice.isLoading;
export const getTopicFormIsLoading = (state: RootState) =>
  state.TopicPageSlice.isLoadingFormData;
export const getTopicFormData = (state: RootState) =>
  state.TopicPageSlice.topicFormData;
