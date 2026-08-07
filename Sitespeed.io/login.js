/**
 * Browsertime preScript for sitespeed.io.
 * Logs in to measurement.cint.com (Auth0 Universal Login) before the
 * main measurement script runs.
 *
 * Requires env vars: MEASUREMENT_EMAIL, MEASUREMENT_PASSWORD
 *
 * NOTE: field ids below were confirmed on the identifier (email) screen.
 * The password screen uses Auth0's default "password" field id, but that
 * step wasn't inspected directly (it requires actually signing in), so
 * verify it once and adjust if needed.
 */
module.exports = async function (context, commands) {
  const email = process.env.MEASUREMENT_EMAIL
  const password = process.env.MEASUREMENT_PASSWORD

  if (!email || !password) {
    throw new Error(
      'Set MEASUREMENT_EMAIL and MEASUREMENT_PASSWORD env vars before running.',
    )
  }

  await commands.navigate('https://measurement.cint.com')

  // Step 1: Auth0 identifier (email) screen
  await commands.wait.byId('username', 10000)
  await commands.addText.byId(email, 'username')
  await commands.click.byXpath("//button[@name='action']")
  await commands.screenshot.take('01-after-identifier')

  // Step 2: Auth0 password screen
  await commands.wait.byId('password', 10000)
  await commands.addText.byId(password, 'password')
  await commands.click.byXpath("//button[@name='action']")

  // Give the app time to finish the post-login redirect, then confirm we
  // actually left Auth0 instead of silently continuing into a broken session
  await commands.wait.byTime(3000)
  await commands.screenshot.take('02-after-login')

  const currentUrl = await commands.js.run('return document.location.href;')
  if (
    currentUrl.includes('auth.lucidhq.com') ||
    currentUrl.includes('/login')
  ) {
    throw new Error(
      `Login did not complete, still on ${currentUrl}. Check the password-step selector ` +
        '(id="password") and the 02-after-login screenshot in the sitespeed output folder.',
    )
  }
}
