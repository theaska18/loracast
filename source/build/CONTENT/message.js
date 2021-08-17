// new Ext.Panel({
	// id : 'MESSAGE.main',
	// layout:{
		// type:'hbox',
		// align:'stretch'
	// },
	// border:false,
	// items:[
		// {
			// xtype:'itable',
			// flex: 1,
			// hideHeaders: true,
			// id:'MESSAGE.list',
			// autoRefresh:false,
			// hideBbar:true,
			// onClick:function(view, a, b, record, c, c, d){
				// var tmp_other = firebase.database().ref('/Chat-tmp/'+_user_id+'/'+record.data.i);
				// tmp_other.update({
					// read:true
				// });
				// if(_mobile==true){
					// Ext.getCmp('MESSAGE.list').hide();
				// }
				// Ext.getCmp('MESSAGE.tab').show();
				// Ext.getCmp('MESSAGE.tab').s=record.data.i;
				// if(Ext.getCmp('MESSAGE.tab-'+record.data.i) ==undefined){
					// var idChat=record.data.i+'_'+_user_id;
					// if(_user_id<record.data.i){
						// idChat=_user_id+'_'+record.data.i;
					// }
					// Ext.getCmp('MESSAGE.tab').add({
						// xtype:'panel',
						// layout:{
							// type:'vbox',
							// align:'stretch'
						// },
						// id:'MESSAGE.tab-'+record.data.i,
						// border:false,
						// items:[
							// {
								// xtype:'panel',
								// flex:1,
								// autoScroll:false,
								// border:false,
								// layout:'fit',
								// html:'<iframe src="'+url+'cmd?m=MESSAGE&f=chat&us='+_user_id+'&id='+idChat+'&session='+_session_id+'" style="width: 100%; height: 100%;overflow:hidden;"></iframe>',
								// tbar:[record.data.name,'->',
									// {
										// iconCls:'fa fa-close',
										// text:'Close',
										// handler:function(){
											// if(_mobile==true){
												// Ext.getCmp('MESSAGE.list').show();
											// }
											// Ext.getCmp('MESSAGE.tab').hide();
										// }
									// }
								// ],
							// },{
								// xtype:'itextarea',
								// margin:false,
								// i:record.data.i,
								// i_name:record.data.name,
								// press:{
									// enter:function(a){
										// var chatref = firebase.database().ref('/Chat');
										// var tmp_me = firebase.database().ref('/Chat-tmp/'+_user_id+'/'+a.i);
										// var tmp_other = firebase.database().ref('/Chat-tmp/'+a.i+'/'+_user_id);
										// var tmp_notif = firebase.database().ref('/Chat-notif/'+a.i);
										// var postData = {
											// msg : a.getValue(),
											// user_id: _user_id,
											// user_code: _user_code,
											// user_name: _user_name,
											// time:firebase.database.ServerValue.TIMESTAMP,
											// read:false,
											// deleted:false,
											// tag:''
										// };
										// var newPostKey = chatref.push().key;
										// var updates = {};
										// updates['/'+idChat+'/'+newPostKey] = postData;
										// firebase.database().ref('/Chat').update(updates);
										// tmp_notif.update({data:{
											// notif:true,
											// msg:_user_name+' : '+a.getValue(),
											// last_user_id:_user_id,
										// }})
										// tmp_me.update({
											// send:true,
											// id_user_from:a.i,
											// name_from:a.i_name,
											// name:_user_name,
											// id_user:_user_id,
											// msg:a.getValue(),
											// deleted:false,
											// read:true,
										// });
										// tmp_other.update({
											// send:false,
											// id_user_from:_user_id,
											// name_from:_user_name,
											// name:a.i_name,
											// id_user:a.i,
											// msg:a.getValue(),
											// deleted:false,
											// read:false
										// });
										// a.setValue(null);
									// }
								// }
							// }
						// ]
					// })
				// }else{
					// Ext.getCmp('MESSAGE.tab').setActiveTab(Ext.getCmp('MESSAGE.tab-'+record.data.i));
				// }
			// },
			// columns:[
				// { hidden:true,dataIndex: 'i' },
				// { hidden:true,dataIndex: 'update' },
				// { text: 'Name',flex:1,dataIndex: 'name'},
				// { text: 'Temp',flex:1,dataIndex: 'tmp'},
				// { text: 'Status',width:50,dataIndex: 'stat'},
			// ]
		// },{
			// xtype:'tabpanel',
			// flex:2,
			// hidden:true,
			// style:'margin-top:-1px;margin-left:-1px;',
			// id:'MESSAGE.tab',
		// }
	// ]
// });