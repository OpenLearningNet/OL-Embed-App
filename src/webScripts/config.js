if (request.method === 'GET') {
   var data = OpenLearning.page.getData(request.user);
   if (data.success) {
      var config = data.data || {};
      config.success = true;
      response.writeJSON(config);
   } else {
      response.setStatusCode(422);
      response.writeJSON({'error': (data.reason || "Unknown error")});
   }
} else if (request.method === 'POST') {
   var hasWritePermission = request.sessionData.permissions && (request.sessionData.permissions.indexOf('write') >= 0);
   if (hasWritePermission) {
      var result = OpenLearning.page.setData(request.data, request.user);
      if (result.success) {
         response.writeJSON({'success': true});
      } else {
         response.setStatusCode(422);
         response.writeJSON({'error': (result.reason || "Unknown error")});
      }
   } else {
      response.setStatusCode(403);
      response.writeJSON({'error': "Insufficient permissions to save config"});
   }
} else {
   response.setStatusCode(405);
   response.setHeader('Allow', 'GET, PUT');
   response.writeJSON({'error': "Not allowed method: " + request.method});
}
