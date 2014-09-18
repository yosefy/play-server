var http = require('http');

InsertElapsedTimeAndCuePoints = {
		adPool: {
			1: { duration: 35000, url: 'http://projects.kaltura.com/yuly/vast1.xml' },
			2: { duration: 30000, url: 'http://projects.kaltura.com/yuly/vast2.xml' },
			3: { duration: 27000, url: 'http://projects.kaltura.com/yuly/vast3.xml' },
			4: { duration: 20000, url: 'http://projects.kaltura.com/yuly/vast4.xml' },
			5: { duration: 155000, url: 'http://projects.kaltura.com/yuly/vast5.xml' },
			6: { duration: 35000, url: 'http://projects.kaltura.com/yuly/vast6.xml' },
			7: { duration: 286000, url: 'http://projects.kaltura.com/yuly/vast7.xml' },
			8: { duration: 35000, url: 'http://projects.kaltura.com/yuly/vast8.xml' },
			9: { duration: 15000, url: 'http://projects.kaltura.com/yuly/vast9.xml' },
			10: { duration: 5000, url: 'http://projects.kaltura.com/yuly/vast10.xml' },
		},
		
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
			
			var randomAdId = Math.floor(Math.random()*10) + 1;
			var adDetails = InsertElapsedTimeAndCuePoints.adPool[randomAdId];
			
			var url = 'http://www.kaltura.com/api_v3/index.php/service/cuePoint_cuePoint/action/add/?format=1&';
			url += 'ks=djJ8MTQwMjg3MnzvHRY4m-GgpMvXo5BOeOvof4JhiLseXDxtWdDD_pkw1080fPqxD9PZ8LqZNx2fDflSH4AWPGWrYDDU87X1G5h6xqxlBdKNaT7GTX-45zHGoM1IVUFOoT8NzFBlADqdVAg';
			url +=	'&cuePoint:objectType=KalturaAdCuePoint&cuePoint:entryId=' + entryId + '&cuePoint:protocolType=VPAID&cuePoint:sourceUrl=' + adDetails.url;
			url += 'cuePoint:adType=1&cuePoint:title=Test+Cue-Point&cuePoint:duration=' + adDetails.duration + '&cuePoint:startTime=';
			
			var entryElapsedTimeKey = KalturaCache.getElapsedTime(entryId);
			KalturaCache.get(entryElapsedTimeKey, function(elapsedTime) {
				if(elapsedTime){
					var timeToInsertCuePoint = elapsedTime.offset + 180000;
					url = url + timeToInsertCuePoint;
						
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