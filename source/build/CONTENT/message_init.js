// // var message_list_cahat = firebase.database().ref('chat_status');
// message_list_cahat.on('child_added', function(snapshot) {
	// var data = snapshot.val();
	// if(data.user_id!==_user_id){
		// var table=Ext.getCmp('MESSAGE.list');
		// var store=table.store;
		// var ada=false;
		// for (var i = 0; i < table.store.data.items.length; i++){
			// var record = store.getAt(i);
			// if(record.data.i==data.user_id){
				// record.set('name', data.name);
				// ada=true;
			// }
		// }
		// if(ada==false && data.name !==undefined){
			// table.store.add({i:data.user_id,update:new Date(),name:data.name,stat:'Y'});
		// }
		// table.getView().refresh();
	// }
// });
// var message_list_tmp = firebase.database().ref('/Chat-tmp/'+_user_id);
// message_list_tmp.on('child_added', function(snapshot) {
	// var data = snapshot.val();
	// if(data.id_user_from!==_user_id){
		// var table=Ext.getCmp('MESSAGE.list');
		// var store=table.store;
		// var ada=false;
		// for (var i = 0; i < table.store.data.items.length; i++){
			// var record = store.getAt(i);
			// if(record.data.i==data.id_user_from){
				// record.set('name', data.name_from);
				// if(data.send==true){
					// record.set('tmp', 'Anda : '+data.msg);
				// }else{
					// record.set('tmp', data.name_from+' : '+data.msg);
				// }
				// ada=true;
			// }
		// }
		// if(ada==false && data.name_from !==undefined){
			// table.store.add({i:data.id_user_from,update:new Date(),name:data.name_from,tmp:data.msg});
		// }
		// table.getView().refresh();
	// }
// });
// message_list_tmp.on('child_changed', function(snapshot) {
	// var data = snapshot.val();
	// if(data.id_user_from!==_user_id){
		// var table=Ext.getCmp('MESSAGE.list');
		// var store=table.store;
		// var ada=false;
		// for (var i = 0; i < table.store.data.items.length; i++){
			// var record = store.getAt(i);
			// if(record.data.i==data.id_user_from){
				// record.set('name', data.name_from);
				// if(data.send==true){
					// record.set('tmp', 'Anda : '+data.msg);
				// }else{
					// record.set('tmp', data.name_from+' : '+data.msg);
				// }
				// ada=true;
			// }
		// }
		// if(ada==false && data.name_from !==undefined){
			// table.store.add({i:data.id_user_from,update:new Date(),name:data.name_from,tmp:data.msg});
		// }
		// table.getView().refresh();
	// }
// });
// Ext.getCmp('MESSAGE.tab').getTabBar().hide();