const { getPriorityNotifications } = require('./services/notificationService');
const { log } = require('../logging_middleware/logger');

async function main() {
  await log('backend', 'info', 'controller', 'Starting main priority notifications display script');

  try {
    const topNotifications = await getPriorityNotifications(10);

    console.log('\n=========================================================');
    console.log('TOP 10 PRIORITY NOTIFICATIONS');
    console.log('=========================================================');
    
    if (topNotifications.length === 0) {
      console.log('No notifications found or returned from the service.');
    } else {
      topNotifications.forEach((notif, index) => {
        const type = notif.Type || notif.type || 'Unknown';
        const message = notif.Message || notif.message || 'No message';
        console.log(`${index + 1}. ${type} - ${message}`);
      });
    }

    console.log('=========================================================\n');
    
    await log('backend', 'info', 'controller', 'Main script completed successfully');
  } catch (error) {
    console.error(`\n[Fatal Error] Unable to retrieve and display priority notifications: ${error.message}\n`);
    await log('backend', 'fatal', 'controller', `Main execution script failed: ${error.message}`);
    process.exit(1);
  }
}

// Execute CLI
if (require.main === module) {
  main();
}

module.exports = main;
