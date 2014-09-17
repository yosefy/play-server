var http = require('http');

InsertElapsedTimeAndCuePoints = {		
			startElapsedTimeInsertion : function(entryId) {
				var insertElapsedTimeKey = 'entryElapsedTimeTracked-' + entryId;
				KalturaCache.add(insertElapsedTimeKey, ' ', 86400, function(){
					InsertElapsedTimeAndCuePoints.inserCuePoints(entryId);
				}, function() {
					KalturaLogger.log('entry ' + entryId + ' elapsed time propbably already tracked due to an earlier request');
				});
			},
		
			inserCuePoints: function(entryId){
				setInterval(function(){
					InsertElapsedTimeAndCuePoints.inserCuePointsLoop(entryId);
				}, 60000);
			},
		
			inserCuePointsLoop: function(entryId) {
				var headers = {
						'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/36.0.1985.143 Safari/537.36',
				}
			
				var url = 'http://www.kaltura.com/api_v3/index.php';
				url = url + '/service/cuePoint_cuePoint/action/add/?format=1&';
				url = url + 'ks=djJ8MTQwMjg3MnzvHRY4m-GgpMvXo5BOeOvof4JhiLseXDxtWdDD_pkw1080fPqxD9PZ8LqZNx2fDflSH4AWPGWrYDDU87X1G5h6xqxlBdKNaT7GTX-45zHGoM1IVUFOoT8NzFBlADqdVAg&cuePoint:objectType=KalturaAdCuePoint&cuePoint:entryId=';
				url = url + entryId + '&cuePoint:startTime=';
			
				var entryElapsedTimeKey = KalturaCache.getElapsedTime(entryId);
				KalturaCache.get(entryElapsedTimeKey, function(elapsedTime) {
					if(elapsedTime){
						var timeToInsertCuePoint = elapsedTime.offset + 180000;
						url = url + timeToInsertCuePoint + '&cuePoint:protocolType=VPAID&cuePoint:sourceUrl=http://shadow01.yumenetworks.com/dynamic_preroll_playlist.vast2xml?domain=1552YmmwFStw&';
						url = url + 'cuePoint:adType=1&cuePoint:title=Test+Cue-Point&cuePoint:duration=15000';
						
						http.get(url, function(res) {
							KalturaLogger.log("Got response: " + res.statusCode);
							}).on('error', function(e) {
								KalturaLogger.log("Got error: " + e.message);
						});
					}
					else{
						KalturaLogger.log('Elapsed time Still not set');
					}
				}, function(error){
					KalturaLogger.log('Fialed to add cue point for entry ' + entryId);
				});
			},
};