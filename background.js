chrome.commands.onCommand.addListener(function (command) {
  if (command === 'make-readable') {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { message: 'make-readable' })
    })
  }
})
