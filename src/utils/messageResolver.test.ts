import { resolveMessage } from './messageResolver';

// Test the message resolver with parameters
function testMessageResolver() {
  // Test E016 with password field
  const message1 = resolveMessage("E016", "password", 8, 20);
  console.log("E016 password:", message1); // Should be "Field password length must be between 8 and 20"
  
  // Test E014 with email field  
  const message2 = resolveMessage("E014", "email");
  console.log("E014 email:", message2); // Should be "Field email cannot be empty"
  
  // Test unknown message code
  const message3 = resolveMessage("UNKNOWN");
  console.log("UNKNOWN:", message3); // Should be "UNKNOWN"
}

testMessageResolver();

export { testMessageResolver };