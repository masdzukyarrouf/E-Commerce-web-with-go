const API_URL = process.env.API_URL || "http://localhost:8080/api";

export async function GET() {
  try {
    const res = await fetch(`${API_URL}/products`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch products: ${res.status}`);
    }

    const data = await res.json();
    return Response.json(data);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const authHeader = req.headers.get('authorization');
    console.log("POST - Auth header present:", !!authHeader);
    
    const contentType = req.headers.get('content-type') || '';
    let response;
    
    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      
      const headers = {};
      if (authHeader) {
        headers['Authorization'] = authHeader; 
      }
      
      response = await fetch(`${API_URL}/products`, {
        method: "POST",
        headers: headers,
        body: formData, 
      });
    } else {
      const body = await req.json();
      
      const headers = {
        'Content-Type': 'application/json'
      };
      if (authHeader) {
        headers['Authorization'] = authHeader; 
      }
      
      response = await fetch(`${API_URL}/products`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(body),
      });
    }

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Backend error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return Response.json(data, { status: 201 });
  } catch (error) {
    console.error("API Error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}