export interface ITab {
  tabId: number;
  title?: string;
  uri?: string;
  list?: IFileInfoDto[];
}

export interface IFileInfo {
  uri: string;
  create_at: number;
  update_at: number;
  contentSize?: string;
}

export type IFileInfoDto = Partial<IFileInfo> &
  Required<Pick<IFileInfo, "uri">>;
