import fetch from 'node-fetch';

async function testProductAPI() {
  try {
    console.log('🧪 TESTING PRODUCT API DIRECTLY\n');
    console.log('='.repeat(80));

    // Test data - minimum required fields
    const productData = {
      code: `TEST-${Date.now()}`,
      name: 'Test Product via API',
      category: 'Test Category',
      sellingPrice: 100
    };

    console.log('\n📤 SENDING REQUEST:');
    console.log(JSON.stringify(productData, null, 2));

    // Note: This test assumes you have authentication set up
    // You may need to add auth headers
    const response = await fetch('http://localhost:3000/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData)
    });

    console.log('\n📥 RESPONSE STATUS:', response.status, response.statusText);

    const responseData = await response.json();

    console.log('\n📥 RESPONSE BODY:');
    console.log(JSON.stringify(responseData, null, 2));

    if (response.ok) {
      console.log('\n✅ SUCCESS! Product created');
    } else {
      console.log('\n❌ ERROR! Product creation failed');
      console.log('Error details:', responseData);
    }

    console.log('\n' + '='.repeat(80));

  } catch (error) {
    console.error('\n❌ REQUEST FAILED:', error.message);
    console.error('Stack:', error.stack);
  }
}

testProductAPI();
