// Quick script to check if environment variables are loaded
// Run with: node check-env.js

// Try to load .env file manually (simple version)
const fs = require('fs')
const path = require('path')

const envPath = path.join(__dirname, '.env')
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8')
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim()
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=')
      if (key && valueParts.length > 0) {
        const value = valueParts.join('=').trim()
        // Remove quotes if present
        const cleanValue = value.replace(/^["']|["']$/g, '')
        process.env[key.trim()] = cleanValue
      }
    }
  })
}

console.log('🔍 Checking environment variables...\n')

const required = ['DATABASE_URL', 'NEXTAUTH_URL', 'NEXTAUTH_SECRET']
const optional = ['GOOGLE_CLIENT_ID', 'AWS_ACCESS_KEY_ID']

let allGood = true

console.log('📋 Required Variables:')
required.forEach(key => {
  const value = process.env[key]
  if (value) {
    // Mask sensitive values
    const display = key === 'DATABASE_URL' 
      ? value.replace(/:[^:@]+@/, ':****@') // Mask password
      : key === 'NEXTAUTH_SECRET'
      ? value.substring(0, 10) + '...'
      : value
    console.log(`  ✅ ${key}: ${display}`)
  } else {
    console.log(`  ❌ ${key}: NOT SET`)
    allGood = false
  }
})

console.log('\n📋 Optional Variables:')
optional.forEach(key => {
  const value = process.env[key]
  if (value) {
    console.log(`  ✅ ${key}: Set`)
  } else {
    console.log(`  ⚠️  ${key}: Not set (optional)`)
  }
})

console.log('\n' + '='.repeat(50))

if (allGood) {
  console.log('✅ All required variables are set!')
  console.log('\n💡 If you still get errors, make sure to:')
  console.log('   1. Restart your dev server (npm run dev)')
  console.log('   2. Check that .env file has no quotes around values')
  console.log('   3. Check that there are no spaces around = sign')
} else {
  console.log('❌ Some required variables are missing!')
  console.log('\n💡 Fix:')
  console.log('   1. Open .env file in project root')
  console.log('   2. Add missing variables')
  console.log('   3. Restart dev server')
}

