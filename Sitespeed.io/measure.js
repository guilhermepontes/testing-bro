/**
 * Browsertime main script for sitespeed.io.
 * Runs after login.js. Measures the studies list, then a study report page.
 *
 * Each measure.start(url, alias) navigates and collects metrics — do not
 * call start() with only an alias unless you also navigate/click inside
 * the start/stop pair (otherwise browsertime reports missing page data).
 *
 * Requires: sitespeed.io --multi (and --spa for this Next.js app).
 */
module.exports = async function (context, commands) {
  await commands.measure.start(
    'https://measurement.cint.com/studies',
    'Studies List',
  )

  return commands.measure.start(
    'https://measurement.cint.com/studies/9904b3d2-9fac-4cca-bdc0-ac870efb6292',
    'Study Details',
  )
}
