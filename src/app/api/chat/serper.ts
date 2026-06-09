type SearchResult = {
  available: boolean;
  text: string;
};

export async function searchInternet(query: string): Promise<SearchResult> {
  const serperKey = process.env.SERPER_API_KEY;

  if (!serperKey) {
    return {
      available: false,
      text: ""
    };
  }

  try {
    const response = await fetch("https://google.serper.dev/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": serperKey
      },
      body: JSON.stringify({
        q: query,
        gl: "vn",
        hl: "vi",
        num: 5
      })
    });

    console.log("SERPER STATUS:", response.status);

    if (!response.ok) {
      const errText = await response.text();
      console.error("SERPER ERROR:", response.status, errText);

      return {
        available: false,
        text: ""
      };
    }

    const data = await response.json();
    const organic = Array.isArray(data?.organic) ? data.organic : [];

    if (!organic.length) {
      return {
        available: false,
        text: ""
      };
    }

    const text = organic
      .slice(0, 5)
      .map((item: any, index: number) => {
        return `${index + 1}. ${item.title || "Không có tiêu đề"}\n${item.snippet || ""}\nNguồn: ${item.link || ""}`;
      })
      .join("\n\n");

    return {
      available: true,
      text
    };
  } catch (error) {
    console.error("Serper search error:", error);

    return {
      available: false,
      text: ""
    };
  }
}