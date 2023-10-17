export enum RedisKey {
    OnlineUsers = 'online-users',
}


export enum RetryTime {
    Init = 0,
    Ten = 10
}

export enum TimeToLive {
    TenSeconds = 10,
    OneMinute = 60,
    OneHour = 60 * 60,
    OneDay = 60 * 60 * 24
}

export enum ResourceTypeEnum {
    Image,
    Video,
    Audio,
    File,
  }
