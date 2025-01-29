document.addEventListener('DOMContentLoaded', function() {
    async function fetchApis() {
        try {
            const productApi = await fetch('http://localhost:8000/api/v1/products');
            if (!productApi.ok) {
                throw new Error(`Product API Error: ${productApi.status}`);
            }
            const productsData = await productApi.json(); 
    
            // Log the fetched data
            console.log("Fetched Products:", productsData.data);
            
            
        } catch (error) {
            console.error("Error fetching data:", error); 
        }
    }
    
    fetchApis();
    
    
})