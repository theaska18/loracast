// Ext.define('ITenant', {
	// alias:'widget.itenant',
	// extend : 'ISelect',
	// // xtype:'iselect',
	// fieldLabel:'Karyawan',
	// id:'USER.input.karyawan',
	// allowBlank : false,
	// valueField:'employee_id',
	// note:'Karyawan yang akan diberi Akses Pengguna.',
	// textField:'name',
	// name:'f5',
	// onBeforeShow:function(){
		// Ext.getCmp('USER.input.btnShowKaryawan.f2').setValue(Ext.getCmp('USER.input.f6').getValue());
	// },
	// button:{
		// items:[
			// {
				// xtype:'itextfield',
				// fieldLabel:'Nama',
				// name:'f2',
				// database:{
					// table:'app_employee',
					// field:'first_name',
					// separator:'like'
				// },
				// press:{
					// enter:function(){
						// Ext.getCmp('USER.input.karyawan').refresh();
					// }
				// },
				// id:'USER.input.btnShowKaryawan.f1'
			// },{
				// xtype:'ihiddenfield',
				// name:'f6',
				// database:{
					// table:'app_employee',
					// field:'M.tenant_id',
					// type:'double',
					// separator:'='
				// },
				// id:'USER.input.btnShowKaryawan.f2',
				// value:_tenant_id
			// },{
				// xtype:'ihiddenfield',
				// name:'f10',
				// database:{
					// table:'app_employee',
					// field:'M.active_flag',
					// type:'active',
				// },
				// value:'Y'
			// },{
				// xtype:'ihiddenfield',
				// name:'f9',
				// database:{
					// table:'app_employee',
					// field:'M.employee_id',
					// type:'none',
					// separator:'not in'
				// },
				// value:'(SELECT i.employee_id FROM app_user i)'
			// },{
				// xtype:'itextfield',
				// name:'f1',
				// fieldLabel:'ID Number',
				// database:{
					// table:'app_employee',
					// field:'id_number',
					// separator:'like'
				// },
				// press:{
					// enter:function(){
						// Ext.getCmp('USER.input.karyawan').refresh();
					// }
				// }
			// },{
				// xtype:'idropdown',
				// name : 'f3',
				// fieldLabel:'Jenis Kelamin',
				// database:{
					// table:'app_employee',
					// field:'gender'
				// },
				// parameter:'GENDER',
				// press:{
					// enter:function(){
						// Ext.getCmp('USER.input.karyawan').refresh();
					// }
				// }
			// },{
				// xtype:'iinput',
				// label :'Tgl. Lahir',
				// items : [
					// {
						// xtype:'idatefield',
						// name : 'f4',
						// margin:false,
						// database:{
							// table:'app_employee',
							// field:'birth_date',
							// separator:'>='
						// },
						// press:{
							// enter:function(){
								// Ext.getCmp('USER.input.karyawan').refresh();
							// }
						// },
						// emptyText: 'Awal'
					// },{
						// xtype:'displayfield',
						// value:' &nbsp; - &nbsp; '
					// },{
						// xtype:'idatefield',
						// margin:false,
						// database:{
							// table:'app_employee',
							// field:'M.birth_date',
							// separator:'<='
						// },
						// name : 'f5',
						// press:{
							// enter:function(){
								// Ext.getCmp('USER.input.karyawan').refresh();
							// }
						// },
						// emptyText:'Akhir'
					// }
				// ]
			// },{
				// xtype:'itextfield',
				// name:'f8',
				// fieldLabel:'Alamat',
				// database:{
					// table:'app_employee',
					// field:'address',
					// separator:'like'
				// },
				// press:{
					// enter:function(){
						// Ext.getCmp('USER.input.karyawan').refresh();
					// }
				// }
			// }
		// ],
		// database:{
			// table:'app_employee',
			// inner:'INNER JOIN app_parameter_option GENDER ON GENDER.option_code=M.gender'
		// },
		// columns:[
			// { hidden:true,dataIndex: 'employee_id',database:{field:'employee_id'} },
			// { text: 'No. ID',width: 80, dataIndex: 'id_number' ,align:'center',database:{field:'id_number'} },
			// { text: 'Nama',width: 200,dataIndex: 'name',database:{field:"CONCAT(CASE WHEN first_name IS NULL THEN '' ELSE first_name END,' ',CASE WHEN last_name IS null THEN '' ELSE last_name END) AS name"} },
			// { text: 'Jenis Kelamin',width: 100,align:'center', dataIndex:'gender' ,database:{field:'GENDER.option_name AS gender'} },
			// { text: 'Tanggal Lahir',width: 100,align:'center', dataIndex: 'birth_date' ,database:{field:'birth_date'} },
			// { text: 'Alamat',width: 100,dataIndex: 'address',flex:1,database:{field:'address'}  },
		// ]
	// }
// })