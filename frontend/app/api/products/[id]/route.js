const API_URL = process.env.API_URL || "http://localhost:8080/api";

export async function GET(request, { params }) {
  try {
    const { id } = await params; 
    
    console.log("Fetching product ID:", id);
    
    const response = await fetch(`${API_URL}/products/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    
    if (!response.ok) {
      return Response.json(
        { 
          error: 'Product not found',
          id: id,
          status: response.status,
          statusText: response.statusText
        },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error('Error fetching product:', error);
    return Response.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params; 
    console.log("Updating product ID:", id);
    
    const token = request.cookies.get('token')?.value;
    console.log("Token from cookies:", token ? "Present" : "Missing");
    
    const contentType = request.headers.get('content-type') || '';
    let response;
    
    if (contentType.includes('multipart/form-data')) {
      console.log("Handling FormData update...");
      const formData = await request.formData();
      
      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`; 
      }
      
      response = await fetch(`${API_URL}/products/${id}`, {
        method: 'PUT',
        headers: headers,
        body: formData, 
      });
    } else {
      console.log("Handling JSON update...");
      const body = await request.json();
      console.log("Update data:", body);
      
      const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`; 
      }
      
      response = await fetch(`${API_URL}/products/${id}`, {
        method: 'PUT',
        headers: headers,
        body: JSON.stringify(body),
      });
    }
    
    console.log("Backend response status:", response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Backend error response:", errorText);
      throw new Error(`Failed to update product: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    return Response.json(data, { status: 200 });
  } catch (error) {
    console.error('Error updating product:', error);
    return Response.json(
      { 
        error: 'Failed to update product', 
        details: error.message 
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params; 
    
    console.log("Deleting product ID:", id);
    
    const token = request.cookies.get('token')?.value;
    console.log("Token from cookies for DELETE:", token ? "Present" : "Missing");
    
    const headers = {
      'Content-Type': 'application/json'
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`; 
    }
    
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: 'DELETE',
      headers: headers,
    });
    
    console.log("Backend DELETE response status:", response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      return Response.json(
        { 
          error: 'Failed to delete product',
          details: errorText,
          id: id,
          status: response.status
        },
        { status: response.status }
      );
    }
    
    return Response.json({ 
      message: "Product deleted successfully",
      id: id 
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    return Response.json(
      { 
        error: 'Internal server error',
        details: error.message 
      },
      { status: 500 }
    );
  }
}