interface ITask {
  id: string;
  title: string;
  description?: string;
  startTime: number;
  endTime: number;
  status: 'ongoing' | 'completed';
  progress?: number;
  updateTime?: number;
}

interface IGlobalData {
  userInfo: WechatMiniprogram.UserInfo | null;
  currentTask: ITask | null;
  tasks: ITask[];
}

interface IAppOption {
  globalData: IGlobalData;
  userInfoReadyCallback?: WechatMiniprogram.GetUserInfoSuccessCallback;
}