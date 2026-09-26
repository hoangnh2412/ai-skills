/** classify() — bảng quyết định ULNL §6, không prompt. */

const STAR4 = { cn_web: "CN_WEB4", ds: "DS4", bc: "BC4" }

export function classify(input) {
  const {
    kind,
    fields = 0,
    columns = 0,
    steps = 0,
    refs = 0,
    has_formula = false,
    special_component = false,
    unclear = false,
  } = input
  if (unclear) {
    const code = STAR4[kind] || "CN_WEB4"
    return { code, split: 1, open_question: true }
  }
  switch (kind) {
    case "nv":
      if (steps < 5) return { code: "NV1", split: 1 }
      if (steps <= 10) return { code: "NV2", split: 1 }
      return { code: "NV3", split: 1 }
    case "gd_web":
      if (fields < 10) return { code: "GD_WEB1", split: 1 }
      if (fields <= 20) return { code: "GD_WEB2", split: 1 }
      return { code: "GD_WEB3", split: 1 }
    case "cn_web":
      if (fields >= 40) return { code: "CN_WEB2", split: 2 }
      if (fields < 10) return { code: "CN_WEB1", split: 1 }
      if (fields <= 20) return { code: "CN_WEB2", split: 1 }
      return { code: "CN_WEB3", split: 1 }
    case "ds":
      if (columns < 10 && !special_component) return { code: "DS1", split: 1 }
      if (columns > 20 || (special_component && columns > 10)) return { code: "DS3", split: 1 }
      return { code: "DS2", split: 1 }
    case "dm":
      if (refs < 1) return { code: "DM1", split: 1 }
      if (refs <= 3) return { code: "DM2", split: 1 }
      throw new Error("DM3 không có MH trong CSDL §7 — làm rõ hoặc bổ sung catalog có version")
    case "bc": {
      const many = fields > 20
      const mid = fields > 10
      if (has_formula && many) return { code: "BC3", split: 1 }
      if (has_formula && fields < 20) return { code: "BC2", split: 1 }
      if (!has_formula && mid) return { code: "BC2", split: 1 }
      if (fields < 10) return { code: "BC1", split: 1 }
      return { code: "BC2", split: 1 }
    }
    case "tt_db":
      if (steps > 20) return { code: "TT_DB2", split: 2 }
      if (steps < 5) return { code: "TT_DB1", split: 1 }
      if (steps <= 10) return { code: "TT_DB2", split: 1 }
      return { code: "TT_DB3", split: 1 }
    default:
      throw new Error(`kind không trong catalog: ${kind}`)
  }
}
