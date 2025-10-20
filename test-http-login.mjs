import fetch from 'node-fetch';

async function testHttpLogin() {
  try {
    console.log('Testing HTTP login via NextAuth API...\n');

    // Test 1: Check if NextAuth API is accessible
    console.log('Step 1: Checking NextAuth providers...');
    const providersResponse = await fetch('http://localhost:3000/api/auth/providers');

    if (!providersResponse.ok) {
      console.log(`❌ Providers endpoint failed: ${providersResponse.status}`);
      return;
    }

    const providers = await providersResponse.json();
    console.log('✅ NextAuth API is accessible');
    console.log('   Available providers:', Object.keys(providers));

    // Test 2: Get CSRF token
    console.log('\nStep 2: Getting CSRF token...');
    const csrfResponse = await fetch('http://localhost:3000/api/auth/csrf');

    if (!csrfResponse.ok) {
      console.log(`❌ CSRF endpoint failed: ${csrfResponse.status}`);
      return;
    }

    const { csrfToken } = await csrfResponse.json();
    console.log('✅ CSRF token obtained');

    // Test 3: Attempt login
    console.log('\nStep 3: Testing login with credentials...');
    const loginResponse = await fetch('http://localhost:3000/api/auth/callback/credentials', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        csrfToken: csrfToken,
        identifier: 'admin@oudperfume.ae',
        password: 'admin123',
        redirect: 'false',
        json: 'true',
      }),
      redirect: 'manual'
    });

    console.log(`   Response status: ${loginResponse.status}`);

    // Check response
    if (loginResponse.status === 200) {
      const result = await loginResponse.json();

      if (result.url) {
        console.log('✅ Login successful!');
        console.log(`   Redirect URL: ${result.url}`);
      } else if (result.error) {
        console.log(`❌ Login failed: ${result.error}`);
      } else {
        console.log('✅ Login appears successful');
        console.log('   Response:', result);
      }
    } else if (loginResponse.status === 302 || loginResponse.status === 307) {
      const location = loginResponse.headers.get('location');
      console.log('✅ Login successful (redirect)');
      console.log(`   Redirect to: ${location}`);
    } else {
      const errorText = await loginResponse.text();
      console.log(`❌ Login failed with status ${loginResponse.status}`);
      console.log('   Response:', errorText.substring(0, 200));
    }

    console.log('\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅  LOGIN SYSTEM TEST COMPLETE');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n📋 Manual Test:');
    console.log('   1. Open: http://localhost:3000/auth/signin');
    console.log('   2. Enter: admin@oudperfume.ae');
    console.log('   3. Password: admin123');
    console.log('   4. Click Sign In');
    console.log('\n✅ If successful, you should be redirected to the dashboard\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
  }
}

testHttpLogin();
