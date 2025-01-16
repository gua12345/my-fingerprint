type TimeParts = Partial<Record<keyof Intl.DateTimeFormatPartTypesRegistry, string>>
const RawDTFormat = Intl.DateTimeFormat
const RawDate = Date

/**
 * 获取时间片段
 */
export const getStandardDateTimeParts = (date: Date, timezone?: string): TimeParts => {
  const parst = new RawDTFormat('en-US', {
    timeZone: timezone ?? 'Asia/Shanghai',
    weekday: 'short',
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    fractionalSecondDigits: 3,
    hour12: false,
    timeZoneName: 'longOffset',
  }).formatToParts(date ?? new RawDate())
  return parst.reduce((acc: TimeParts, cur) => {
    acc[cur.type] = cur.value
    return acc
  }, {})
}

// 添加获取时区信息的函数
export async function getTimeZoneFromIP(): Promise<TimeZoneInfo> {
  try {
    const response = await fetch('http://ip-api.com/json/?fields=timezone,offset');
    const data = await response.json();
    
    return {
      text: data.timezone,
      offset: data.offset / 3600, // 转换为小时
      zone: data.timezone,
      locale: navigator.language
    };
  } catch (error) {
    // 如果获取失败，返回默认时区
    return {
      text: Intl.DateTimeFormat().resolvedOptions().timeZone,
      offset: -(new Date().getTimezoneOffset() / 60),
      zone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      locale: navigator.language
    };
  }
}