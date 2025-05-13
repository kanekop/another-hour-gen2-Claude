// public/js/timezone-manager.js

// city-timezones.js からタイムゾーン候補のデータをインポート
import { cityCandidatesByOffset } from './city-timezones.js';

// World Clock で表示する基準となるUTCオフセット（分単位）
// このリストは world-clock-ui.js から移動し、ここで一元管理します。
const TARGET_UTC_OFFSETS_MINUTES = [
  720, 660, 600, 540, 480, 420, 360, 300, 240, 180, 120, 60,
  0, -60, -120, -180, -240, -300, -360, -420, -480, -540, -600, -660
].sort((a, b) => b - a); // オフセットが大きい順（例: UTC+12 から UTC-11 へ）でソートしておく

/**
 * World Clock および Main Clock のドロップダウンに表示する
 * タイムゾーンのリストを生成します。
 * moment.js がロードされている必要があります。
 * @returns {Array<Object>} タイムゾーンオブジェクトの配列。各オブジェクトは以下の形式:
 * {
 * timezone: string, // IANAタイムゾーン名 (例: "Asia/Tokyo")
 * city: string,     // 表示用の都市名 (例: "Tokyo (Japan)")
 * offset: number,   // 現在のUTCオフセット（分単位）
 * offsetString: string, // 表示用のオフセット文字列 (例: "UTC+9")
 * displayText: string // ドロップダウン用の表示テキスト (例: "Tokyo (Japan) (UTC+9)")
 * }
 */
export function getDisplayTimezones() {
  if (typeof moment === 'undefined' || typeof moment.tz === 'undefined') {
    console.error("Moment.js and Moment Timezone are not loaded.");
    return [];
  }

  const selectedTimezones = new Set(); // 重複するIANA名を選択しないようにするため
  const displayTimezones = [];

  TARGET_UTC_OFFSETS_MINUTES.forEach(targetOffset => {
    const candidates = cityCandidatesByOffset[targetOffset.toString()] || [];
    let bestCandidate = null;

    // ターゲットオフセットに完全に一致し、まだ選択されていないものを探す
    for (const candidate of candidates) {
      const currentActualOffset = moment.tz(candidate.timezone).utcOffset();
      if (currentActualOffset === targetOffset && !selectedTimezones.has(candidate.timezone)) {
        if (!bestCandidate || candidate.priority < bestCandidate.priority) {
          bestCandidate = candidate;
        }
      }
    }

    // 見つからなければ、オフセットが異なる可能性を許容してフォールバック (優先度順)
    if (!bestCandidate) {
      for (const candidate of candidates.sort((a, b) => a.priority - b.priority)) {
        if (!selectedTimezones.has(candidate.timezone)) {
          bestCandidate = candidate;
          break;
        }
      }
    }

    if (bestCandidate) {
      selectedTimezones.add(bestCandidate.timezone);
      const currentOffset = moment.tz(bestCandidate.timezone).utcOffset();
      const offsetHours = currentOffset / 60;
      const sign = offsetHours >= 0 ? '+' : '-';
      const absHours = Math.abs(offsetHours);
      const offsetString = `UTC${sign}${String(absHours).padStart(2, '0')}`; // 例: UTC+9, UTC-5

      displayTimezones.push({
        timezone: bestCandidate.timezone,
        city: bestCandidate.city,
        offset: currentOffset,
        offsetString: offsetString,
        displayText: `${bestCandidate.city} (${offsetString})`
      });
    } else {
      // フォールバックとしてオフセット情報のみでエントリを作成することも検討可能
      // もし cityCandidatesByOffset に適切な候補がない場合など
      const offsetHours = targetOffset / 60;
      const sign = offsetHours >= 0 ? '+' : '-';
      const absHours = Math.abs(offsetHours);
      const genericTimezone = `Etc/GMT${offsetHours >= 0 ? '-' : '+'}${absHours}`; // moment.jsが解釈できる形式で
      const fallbackCityName = `UTC${sign}${String(absHours).padStart(2, '0')}:00`;

      // このフォールバックが重複しないように、かつリストの数を保つように注意
      if (!selectedTimezones.has(genericTimezone)) {
          selectedTimezones.add(genericTimezone);
          displayTimezones.push({
              timezone: genericTimezone,
              city: fallbackCityName,
              offset: targetOffset,
              offsetString: `UTC${sign}${String(absHours).padStart(2, '0')}`,
              displayText: `${fallbackCityName}`
          });
      }
    }
  });

  // TARGET_UTC_OFFSETS_MINUTES の数と一致しない場合、問題がある可能性
  if (displayTimezones.length !== TARGET_UTC_OFFSETS_MINUTES.length) {
    console.warn("The number of generated display timezones does not match the target offsets count. Check cityCandidatesByOffset and TARGET_UTC_OFFSETS_MINUTES.");
  }

  // 最終的なリストを都市名（displayText）でソートする
  // (またはオフセット順のままにするか、要件によります。ここではオフセット順を維持)
  // displayTimezones.sort((a, b) => a.displayText.localeCompare(b.displayText));

  return displayTimezones;
}

/**
 * ユーザーのローカルIANAタイムゾーン名を取得します。
 * moment.js がロードされている必要があります。
 * @returns {string|null} IANAタイムゾーン名、または取得失敗時はnull
 */
export function getUserLocalTimezone() {
  if (typeof moment === 'undefined' || typeof moment.tz === 'undefined') {
    console.error("Moment.js and Moment Timezone are not loaded for getUserLocalTimezone.");
    return null;
  }
  return moment.tz.guess();
}

/**
 * 指定されたIANAタイムゾーン名に対応する都市名を取得します。
 * 主に `cityCandidatesByOffset` から引きますが、見つからない場合はタイムゾーン名をそのまま返すことも検討。
 * @param {string} timezoneName - IANAタイムゾーン名
 * @returns {string} 都市名、または見つからない場合はタイムゾーン名
 */
export function getCityNameByTimezone(timezoneName) {
    for (const offsetKey in cityCandidatesByOffset) {
        const candidates = cityCandidatesByOffset[offsetKey];
        const found = candidates.find(c => c.timezone === timezoneName);
        if (found) {
            return found.city;
        }
    }
    // cityCandidatesByOffset に見つからない場合、timezone名から都市名を推測するか、
    // あるいは timezoneName をそのまま返す
    // ここでは簡易的に、'/' で分割した最後の部分を返す例
    // (例: "America/New_York" -> "New York")
    // より堅牢な方法が必要な場合は、追加のロジックやマッピングが必要
    const parts = timezoneName.split('/');
    return parts.length > 1 ? parts[parts.length - 1].replace(/_/g, ' ') : timezoneName;
}