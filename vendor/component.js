//itextfield
Ext.define('ITextField', {
	alias:'widget.itextfield',
	extend: 'Ext.form.TextField',
	property:{},
	press:{},
	event:{},
	enableKeyEvents:true,
	margin:true,
	labelAlign:'right',
	initComponent:function(){
		var property=this.property,event=this.event,$this=this;
		property.type='textfield';
		if(this.listeners==undefined){this.listeners=[];}	
		//blur
		var blurOri=null;
		if(this.listeners.blur!=undefined){blurOri=this.listeners.blur;}
		var blur=function(textfield,e){
			if(blurOri != null){blurOri(textfield,e);}
			if(event.blur != undefined){event.blur(textfield,e);}
			textfield.val(textfield.getValue());
			if($this.user_property!= undefined){
				Ext.Ajax.request({
					url : url + 'admin/setUserProperty',
					method : 'POST',
					params : {code : $this.user_property.code,name:$this.user_property.name,value:$this.getValue()},
					success : function(response) {var r = ajaxSuccess(response);},
					failure : function(jqXHR, exception) {ajaxError(jqXHR, exception,true);}
				});
			}
		};
		this.listeners.blur=blur;
		//focus
		var focusOri=null;
		if(this.listeners.focus!=undefined){focusOri=this.listeners.focus;}
		var focus=function(textfield,e){
			if(focusOri != null){focusOri(textfield,e);}
			if(event.focus != undefined){event.focus(textfield,e);}
		};
		this.listeners.focus=focus;
		//keydown
		var keydownOri=null;
		if(this.listeners.keydown!=undefined){keydownOri=this.listeners.keydown;}
		var keydown=function(textfield,e){
			if(keydownOri != null){keydownOri(textfield,e);}
			if(e.keyCode == 13){textfield.val(textfield.getValue());}
			_ctrl(textfield,e);
			return false;
		};
		this.listeners.keydown=keydown;
		if(this.maxLength==undefined){this.maxLength=64;}
		var allowBlank='';
		if(this.allowBlank != undefined && this.allowBlank ==false){allowBlank='<span style="color:red;">*</span>';}
		var labelWidth=95;
		if(this.labelWidth != undefined){labelWidth=this.labelWidth-5;}
		if(this.fieldLabel != undefined && this.fieldLabel !=''){
			if(this.width == undefined && this.anchor==undefined){this.anchor='100%';}
			this.emptyText=this.fieldLabel.replace('<br>','');
			var cssWidth='';
			if(this.labelAlign=='right'){
				cssWidth='width:'+labelWidth+'px;';
			}
			this.fieldLabel='<span style="float:left;text-align:left;text-overflow: ellipsis;white-space: nowrap;overflow: hidden;'+cssWidth+'" title="'+this.fieldLabel+'">'+this.fieldLabel+allowBlank+'</span>';		
		};
		this.load=function(){
			if($this.user_property!= undefined){
				Ext.Ajax.request({
					url : url + 'admin/getUserProperty',
					method : 'GET',
					params : {code : $this.user_property.code,name:$this.user_property.name},
					success : function(response) {var r = ajaxSuccess(response);if (r.r == 'S'){$this.setValue(r.d);}},
					failure : function(jqXHR, exception) {ajaxError(jqXHR, exception,true);}
				});
			}
		};
		this.callParent(arguments);
		this.load();
	},
	val:function(val){
		var textfield=this,property=textfield.property;
		val=val.trim().replace(/  +/g, ' ');
		if(property.space != undefined && property.space===false){val=val.replace(/ /g,'');}
		if(property.upper != undefined && property.upper===true){val=val.toUpperCase();}
		if(property.lower != undefined && property.lower===true){val=val.toLowerCase();}
		if(property.dynamic != undefined && property.dynamic===true){val=val.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1);});}
		textfield.setValue(val);
	}
});
//idatefield
Ext.define('IDateField', {
	alias:'widget.idatefield',
	extend: 'Ext.form.DateField',
	result:'none',
	property:{},
	press:{},
	event:{},
	space:true,
	format:'d/m/Y',
	enableKeyEvents:true,
	margin:true,
	labelAlign:'right',
	initComponent:function(){
		var property=this.property,event=this.event,$this=this;
		property.type='datefield';
		if(this.listeners==undefined){this.listeners=[];}
		//blur
		var blurOri=null;
		if(this.listeners.blur!=undefined){blurOri=this.listeners.blur;}
		var blur=function(textfield,e){
			if(blurOri != null){blurOri(textfield,e);}
			if(event.blur != undefined){event.blur(textfield,e);}
		};
		this.listeners.blur=blur;
		//focus
		var focusOri=null;
		if(this.listeners.focus!=undefined){focusOri=this.listeners.focus;}
		var focus=function(textfield,e){if(focusOri != null){focusOri(textfield,e);}if(event.focus != undefined){event.focus(textfield,e);}};
		this.listeners.focus=focus;
		//keydown
		var keydownOri=null;
		if(this.listeners.keydown!=undefined){keydownOri=this.listeners.keydown;}
		var keydown=function(textfield,e){if(keydownOri != null){keydownOri(textfield,e);}_ctrl(textfield,e);return false;};
		this.listeners.keydown=keydown;
		var allowBlank='';
		if(this.allowBlank != undefined && this.allowBlank ==false){allowBlank='<span style="color:red;">*</span>';}
		if(this.fieldLabel != undefined && this.fieldLabel !=''){
			if($this.width == undefined){$this.width=200;}
			this.emptyText=this.fieldLabel.replace('<br>','');
			this.fieldLabel='<span style="float:left;text-align:left;">'+this.fieldLabel+allowBlank+'</span>';	
		}else{if($this.width == undefined){this.width=100;}}
		this.callParent(arguments);
	},
	listeners:{keypress:function(textfield,eo){if(eo.getCharCode()==Ext.EventObject.ENTER){if(textfield.submit != undefined){Ext.get(textfield.submit).dom.click();}}}},
	val:function(data){
		var value=this.getValue(),format='';
		if(value != null){
			var month=value.getMonth()+1,date=value.getDate();
			if(month.toString().length==1){month='0'+month.toString();}
			if(date.toString().length==1){date='0'+date.toString();}
			var format=value.getFullYear()+'-'+month+'-'+date;
		}
		return format;
	}
});
//iinput
Ext.define('IInput', {
	alias:'widget.iinput',
	extend: 'Ext.Panel',
	label:'',
	xWidth:96,
	q:{type:'input'},
	yWidth:'auto',
	separator:':',
	nullData:true,
	separatorWidth:9,
	layout:{type:'hbox',align:'stretch'},
	bold:false,
	margin:true,
	cls:'i-input',
	bodyStyle:' background: transparent;',
	border:false,
	initComponent:function(){
		var cmp=this.items,$this=this,nullData='';
		if($this.tooltip != undefined)
			cmp.push({xtype:'button',tabIndex:-1,iconCls:'fa fa-info-circle',tooltip:$this.tooltip,border: 0,style:'background: none;'});
		if($this.bold==true){$this.label='<b>'+$this.label+'</b>';}
		if(this.nullData==false){nullData='<font color="red">*</font>';}
		this.items=[
			{
				xtype:'panel',
				layout:'column',
				border:false,
				cls:'i-transparent i-input-label',
				bodyStyle:'background: transparent;',
				border:false,
				items:[
					{
						xtype:'displayfield',
						q:{type:'displayfield'},
						value:this.label+nullData,
						width:this.xWidth
					},{
						xtype:'displayfield',
						q:{type:'displayfield'},
						value:this.separator,
						width:this.separatorWidth
					}
				]
			},{
				xtype:'panel',
				layout:'column',
				flex:1,
				cls:'i-transparent',
				bodyStyle:'background: transparent;',
				width:this.yWidth,
				border:false,
				items:cmp
			}
		];
		this.callParent(arguments);
	}
});
//idropdown
Ext.define('IDropDown', {
	alias:'widget.idropdown',
	extend:'Ext.form.ComboBox',store: {xtype:'array'},queryMode: 'local',property:{},press:{},event:{},forceSelection :true,displayField: 'text',valueField: 'id',
	rawField:'text',emptyText:'Pilih -',enableKeyEvents:true,listeners:{},margin:true,labelAlign:'right',dataSelect:{},
	load:function(query){
		var $this=this;
		if(query != undefined){$this.query=query;}
		if($this.parameter != undefined && query == undefined){
			var tmpParam=localStorage.getItem('PARAMETER.'+$this.parameter);
			if(tmpParam == undefined || tmpParam==null || tmpParam==''){
				Ext.Ajax.request({
					url : url+'fn/parameter/getParameter',
					method : 'GET',
					params:{param:$this.parameter},
					success : function(response) {
						var r = ajaxSuccess(response);
						if (r.r == 'S') {$this.addReset(r.d);localStorage.setItem('PARAMETER.'+$this.parameter,JSON.stringify(r.d));$this.loadData();}
					},failure : function(jqXHR, exception) {ajaxError(jqXHR, exception,true);}
				});
			}else{$this.addReset(JSON.parse(tmpParam));$this.loadData();}
		}
		if($this.query != undefined){
			Ext.Ajax.request({
				url : url+'fn/parameter/getParameter',
				method : 'GET',
				params:{query:$this.query},
				success : function(response) {var r = ajaxSuccess(response);if (r.r == 'S') {$this.addReset(r.d);$this.loadData();}},
				failure : function(jqXHR, exception) {ajaxError(jqXHR, exception,true);}
			});
		}
		if($this.url != undefined){
			Ext.Ajax.request({
				url : $this.url,
				method : 'GET',
				success : function(response) {var r = ajaxSuccess(response);if (r.r == 'S') {$this.addReset(r.d);$this.loadData();}},
				failure : function(jqXHR, exception) {ajaxError(jqXHR, exception,true);}
			});
		}
	},
	initComponent:function(){
		var fields=['id','text'],data=[],$this=this;
		if(this.fields!= undefined){fields=this.fields;}
		this.store=new Ext.data.Store({data:data,fields:fields});
		if(this.data!=undefined){this.store.add(this.data);}
		var property=this.property,event=this.event;
		property.type='dropdown';
		this.tmpValue=this.value;
		if(this.listeners==undefined){this.listeners=[];}
		var selectOri=null;
		if(this.listeners.select!=undefined){selectOri=this.listeners.select;}
		var select=function( combo, records, eOpts ){
			if (records[0] != undefined){combo.setRawValue(records[0].data[combo.rawField]);}
			if (records[0] != undefined){combo.dataSelect=records[0].raw;}
			if(selectOri != null){selectOri( combo, records, eOpts );}
			if(event.select != undefined){event.select( combo, records, eOpts );}
		};
		this.listeners.select=select;
		var blurOri=null;
		if(this.listeners.blur!=undefined){blurOri=this.listeners.blur;}
		var blur=function(textfield,e){
			if(blurOri != null){blurOri(textfield,e);}
			if(event.blur != undefined){event.blur(textfield,e);}
			if (textfield.valueModels[0] !== undefined){textfield.setRawValue(textfield.valueModels[0].data[textfield.rawField]);}
			if($this.user_property!= undefined){
				Ext.Ajax.request({
					url : url + 'admin/setUserProperty',
					method : 'POST',
					params : {code : $this.user_property.code,name:$this.user_property.name,value:$this.getValue()},
					success : function(response) {var r = ajaxSuccess(response);},
					failure : function(jqXHR, exception) {ajaxError(jqXHR, exception,true);}
				});
			;}
		};
		this.listeners.blur=blur;
		var focusOri=null;
		if(this.listeners.focus!=undefined){focusOri=this.listeners.focus;}
		var focus=function(textfield,e){if(focusOri != null){focusOri(textfield,e);}if(event.focus != undefined){event.focus(textfield,e);}};
		this.listeners.focus=focus;
		//keydown
		var keydownOri=null;
		if(this.listeners.keydown!=undefined){keydownOri=this.listeners.keydown;}
		var keydown=function(textfield,e){
			if(keydownOri != null){keydownOri(textfield,e);}
			_ctrl(textfield,e);
			var nav=navigator.platform.match("Mac");
			if (e.keyCode == 68 && ( nav? e.metaKey : e.ctrlKey)){textfield.setValue(null);$this.load();e.preventDefault();}
			return false;
		};
		this.listeners.keydown=keydown;
		var allowBlank='';
		if(this.allowBlank != undefined && this.allowBlank ==false){allowBlank='<span style="color:red;">*</span>';}
		var labelWidth=95;
		if(this.labelWidth != undefined){labelWidth=this.labelWidth-5;}
		if(this.fieldLabel != undefined && this.fieldLabel !=''){
			if(this.width == undefined && this.anchor==undefined){this.anchor='100%';}
			this.emptyText=this.fieldLabel.replace('<br>','');
			var cssWidth='';
			if(this.labelAlign=='right'){
				cssWidth='width:'+labelWidth+'px;';
			}
			this.fieldLabel='<span style="float:left;text-align:left;text-overflow: ellipsis;white-space: nowrap;overflow: hidden;'+cssWidth+'" title="'+this.fieldLabel+'">'+this.fieldLabel+allowBlank+'</span>';	
		}
		this.loadData=function(){
			if($this.user_property!= undefined){
				Ext.Ajax.request({
					url : url + 'admin/getUserProperty',
					method : 'GET',
					params : {code : $this.user_property.code,name:$this.user_property.name},
					success : function(response) {var r = ajaxSuccess(response);if (r.r == 'S'){$this.setValue(r.d);}},
					failure : function(jqXHR, exception) {ajaxError(jqXHR, exception,true);}
				});
			}
		};
		this.callParent(arguments);
		this.load();
	},
	setVal:function(val){this.setValue(val);if (this.valueModels[0] != undefined){this.setRawValue(this.valueModels[0].data[this.rawField]);}},
	addData:function(data){this.store.add(data);},
	setQuery:function(query,val,callback){
		var $this=this;
		$this.query=query;
		Ext.Ajax.request({
			url : url+'fn/parameter/getParameter',
			method : 'GET',
			params:{query:$this.query},
			before:function(){$this.disable();},
			success : function(response) {
				$this.enable();
				var r = ajaxSuccess(response);
				if (r.r == 'S') {$this.addReset(r.d);if(val != undefined){$this.setValue(val);}if(callback != undefined){callback($this);}}
			},
			failure : function(jqXHR, exception) {$this.enable();ajaxError(jqXHR, exception,true);}
		});
	},
	setUrl:function(query,val,callback){
		var $this=this;
		$this.url=query;
		Ext.Ajax.request({
			url : query,
			method : 'GET',
			before:function(){$this.disable();},
			success : function(response) {
				$this.enable();
				var r = ajaxSuccess(response);
				if (r.r == 'S') {$this.addReset(r.d);if(val != undefined){$this.setValue(val);}if(callback != undefined){callback($this);}}
			},
			failure : function(jqXHR, exception) {$this.enable();ajaxError(jqXHR, exception);}
		});
	},
	addReset:function(data,first){
		var val=this.getValue();
		if(this.store != null && this.store.loadData != null){
			this.store.loadData([],false);
			this.store.add(data);
		}
		if(val==null || val==undefined || val==''){
			if(this.tmpValue != null && this.tmpValue != undefined && this.tmpValue !=''){
				this.setValue(this.tmpValue);
			}
		}else{
			this.setValue(val);
		}
	}
});
//ihiddenfield
Ext.define('IHiddenField', {
	alias:'widget.ihiddenfield',
	extend:'Ext.form.Hidden',
	property:{type:'hidden'}
});
//icheckbox
Ext.define('ICheckBox', {
	alias:'widget.icheckbox',
	extend:'Ext.form.Checkbox',
	property:{type:'checkbox'},
	margin:true,
	labelAlign:'right',
	initComponent:function(){
		var allowBlank='';
		if(this.allowBlank != undefined && this.allowBlank ==false){allowBalnk='<span style="color:red;">*</span>';}
		var labelWidth=95;
		if(this.labelWidth != undefined){labelWidth=this.labelWidth-5;}
		if(this.fieldLabel != undefined && this.fieldLabel !=''){
			if(this.width == undefined && this.anchor==undefined){this.anchor='100%';}
			this.emptyText=this.fieldLabel.replace('<br>','');
			var cssWidth='';
			if(this.labelAlign=='right'){
				cssWidth='width:'+labelWidth+'px;';
			}
			this.fieldLabel='<span style="float:left;text-align:left;text-overflow: ellipsis;white-space: nowrap;overflow: hidden;'+cssWidth+'" title="'+this.fieldLabel+'">'+this.fieldLabel+allowBlank+'</span>';	
		}
		this.callParent(arguments);
	}
});
//itextarea
Ext.define('ITextArea', {
	alias:'widget.itextarea',
	extend:'Ext.form.TextArea',
	property:{},
	press:{},
	event:{},
	enableKeyEvents:true,
	margin:true,
	height:47,
	labelAlign:'right',
	initComponent:function(){
		var property=this.property,event=this.event;
		property.type='textfield';
		if(this.listeners==undefined){this.listeners=[];}
		//blur
		var blurOri=null;
		if(this.listeners.blur!=undefined){blurOri=this.listeners.blur;}
		var blur=function(textfield,e){
			if(blurOri != null){blurOri(textfield,e);}
			if(event.blur != undefined){event.blur(textfield,e);}
		};
		this.listeners.blur=blur;
		//focus
		var focusOri=null;
		if(this.listeners.focus!=undefined){focusOri=this.listeners.focus;}
		var focus=function(textfield,e){
			if(focusOri != null){focusOri(textfield,e);}
			if(event.focus != undefined){event.focus(textfield,e);}
		};
		this.listeners.focus=focus;
		//keydown
		var keydownOri=null;
		if(this.listeners.keydown!=undefined){keydownOri=this.listeners.keydown;}
		var keydown=function(textfield,e){
			if(keydownOri != null){keydownOri(textfield,e);}
			_ctrl(textfield,e);
			return false;
		};
		this.listeners.keydown=keydown;
		//specialkey
		var specialkeyOri=null;
		if(this.listeners.specialkey!=undefined){specialkeyOri=this.listeners.specialkey;}
		var specialkey=function(field,e){
			if(specialkeyOri != null){specialkeyOri(textfield,e);}
			if (this.property.tab != undefined && this.property.tab==true && e.getKey() == e.TAB) {
				e.stopEvent();
				var el = field.inputEl.dom;
				if (el.setSelectionRange) {
					var withIns = el.value.substring(0, el.selectionStart) + '\t',pos = withIns.length;
					el.value = withIns + el.value.substring(el.selectionEnd, el.value.length);
					el.setSelectionRange(pos, pos);
				}else if (document.selection) {document.selection.createRange().text = '\t';}
			}
			return false;
		};
		this.listeners.specialkey=specialkey;
		if(this.maxLength==undefined){this.maxLength=128;}
		var allowBlank='';
		
		if(this.allowBlank != undefined && this.allowBlank ==false){allowBlank='<span style="color:red;">*</span>';}
		var labelWidth=95;
		if(this.labelWidth != undefined){labelWidth=this.labelWidth-5;}
		if(this.fieldLabel != undefined && this.fieldLabel !=''){
			if(this.width == undefined && this.anchor==undefined){this.anchor='100%';}
			this.emptyText=this.fieldLabel.replace('<br>','');
			var cssWidth='';
			if(this.labelAlign=='right'){
				cssWidth='width:'+labelWidth+'px;';
			}
			this.fieldLabel='<span style="float:left;text-align:left;text-overflow: ellipsis;white-space: nowrap;overflow: hidden;'+cssWidth+'" title="'+this.fieldLabel+'">'+this.fieldLabel+allowBlank+'</span>';		
		}
		this.callParent(arguments);
	}
});
//ipanel
Ext.define('IPanel', {
	alias:'widget.ipanel',
	extend : 'Ext.form.Panel',border : false,autoWidth : true,autoHeight : true,anchor:'100%',autoScroll: true,paddingBottom:true,
	bodyStyle:'padding-right: -1px;padding-bottom:5px;',autoSize : true,q : {type : 'panel',tmp:{},focusLoad:''},fReq:true,scrollable : true,qLastForm : {},
	initComponent:function(){
		var bodyStyle='';
		if(this.bodyStyle != undefined){bodyStyle=this.bodyStyle;}
		if(this.title != undefined && this.style != undefined){this.border=true;this.style='margin: -1px 0 0 -1px;';}
		if(this.paddingBottom===true){this.bodyStyle='padding-right: -1px;padding-bottom:5px;';
		}else{this.bodyStyle='padding-right: -1px;';}
		this.callParent(arguments);
		if(this.init != undefined){this.init();}
	},
	qFinder : function(arr, $this,load) {
		var t=this,valid=false,property=$this.property,type='',bArr=false;
		if(property !== undefined && $this.name !== undefined && $this.name.substring(($this.name.length-7),$this.name.length)!='inputEl'){
			type=property.type;
			if($this.name.substring(($this.name.length-2),$this.name.length)=='[]'){bArr=true;}
		}
		if (type == 'textfield'|| type == 'dropdown' || type == 'hidden' || type == 'checkbox'|| type == 'radio' || type == 'autocomplete'|| type == 'numberfield'|| type == 'select') {
			if(bArr===true){
				if(arr[$this.name]==undefined){arr[$this.name]=[];}
				if(type=='numberfield'){arr[$this.name].push($this._getValue());
				}else{arr[$this.name].push($this.getValue());}
				if($this.database != undefined){
					var database=$this.database ;
					if(load != undefined){
						var dis=false;
						$this.setValue(load[database.table][database.field]);
						if(t.database.command[database.table].primary==database.field){$this.setReadOnly(true);dis=true;}
						if(t.database.command[database.table].unique != undefined){
							for(var i=0,iLen=t.database.command[database.table].unique.length;i<iLen;i++){
								if(t.database.command[database.table].unique[i].field==database.field){$this.setReadOnly(true);dis=true;break;}
							}
						}
						if(dis==false && t.q.focusLoad=='' && type!='hidden'){t.q.focusLoad=$this.id;}
					}
					if(t.q.tmp[database.table]== undefined){t.q.tmp[database.table]=[];}
					var dataField={};
					dataField[database.field]={};
					var field=dataField[database.field];
					if(type=='numberfield'){field['value']=$this._getValue();}else{field['value']=$this.getValue();}
					if(database.option != undefined){field['option']=database.option;}
					if(database.separator != undefined){field['separator']=database.separator;}
					if(database.type != undefined){field['type']=database.type;}else{if(type == 'checkbox'){field['type']='boolean';}}
					if(database.primary != undefined && database.primary===true){field['primary']=true;}
					t.q.tmp[database.table].push(dataField);
				}
			}else{
				if(type=='numberfield'){if($this._getValue != undefined){arr[$this.name] = $this._getValue();}
				}else{if($this.getValue != undefined){arr[$this.name] = $this.getValue();}}
				if($this.database != undefined){
					var database=$this.database;
					if(load != undefined){
						var dis=false;
						$this.setValue(load[database.table][database.field]);
						if(t.database.command[database.table].primary==database.field){$this.setReadOnly(true);dis=true;}
						if(t.database.command[database.table].unique != undefined){
							for(var i=0,iLen=t.database.command[database.table].unique.length;i<iLen;i++){
								if(t.database.command[database.table].unique[i].field==database.field){$this.setReadOnly(true);dis=true;break;}
							}
						}
						if(dis==false && t.q.focusLoad=='' && type!='hidden'){t.q.focusLoad=$this.id;}
					}
					if(t.q.tmp[database.table]== undefined){t.q.tmp[database.table]={};}
					t.q.tmp[database.table][database.field]={};
					var field=t.q.tmp[database.table][database.field];
					if(type=='numberfield'){field['value']=$this._getValue();}else{field['value']=$this.getValue();}
					if(database.option != undefined){field['option']=database.option;}
					if(database.separator != undefined){field['separator']=database.separator;}
					if(database.type != undefined){field['type']=database.type;}else{if(type == 'checkbox'){field['type']='boolean';}}
					if(database.primary != undefined && database.primary===true){field['primary']=true;}
				}
			}
			if($this.readOnly===false){if(t.req==true && $this.validate()==false){valid=true;if(t.fReq==true){t.fReq=false;$this.focus();}}}
		}else if (type == 'htmleditor'){
			if(bArr===true){
				if(arr[$this.name]==undefined){arr[$this.name]=[];}
				arr[$this.name].push($this.getValue());
				if($this.database != undefined){
					var database=$this.database ;
					if(load != undefined){
						var dis=false;
						$this.setValue(load[database.table][database.field]);
						if(t.database.command[database.table].primary==database.field){$this.disable();dis=true;}
						if(t.database.command[database.table].unique != undefined){
							for(var i=0,iLen=t.database.command[database.table].unique.length;i<iLen;i++){
								if(t.database.command[database.table].unique[i].field==database.field){$this.disable();dis=true;break;}
							}
						}
						if(dis==false && t.q.focusLoad==''){t.q.focusLoad=$this.id;}
					}
					if(t.q.tmp[database.table]== undefined){t.q.tmp[database.table]=[];}
					var dataField={};
					dataField[database.field]={};
					var field=dataField[database.field];
					field['value']=$this.getValue();
					field['type']='html';
					if(database.primary != undefined && database.primary===true){field['primary']=true;}
					t.q.tmp[database.table].push(dataField);
				}
			}else{
				arr[$this.name] = $this.getValue();
				if($this.database != undefined){
					var database=$this.database ;
					if(load != undefined){
						var dis=false;
						$this.setValue(load[database.table][database.field]);
						if(t.database.command[database.table].primary==database.field){$this.setReadOnly(true);dis=true;}
						if(t.database.command[database.table].unique != undefined){
							for(var i=0,iLen=t.database.command[database.table].unique.length;i<iLen;i++){
								if(t.database.command[database.table].unique[i].field==database.field){$this.setReadOnly(true);dis=true;break;}
							}
						}
						if(dis==false && t.q.focusLoad==''){t.q.focusLoad=$this.id;}
					}
					if(t.q.tmp[database.table]== undefined){t.q.tmp[database.table]={};}
					t.q.tmp[database.table][database.field]={};
					var field=t.q.tmp[database.table][database.field];
					field['value']=$this.getValue();
					field['type']='html';
					if(database.primary != undefined && database.primary===true){field['primary']=true;}
				}
			}
		}else if(type == 'datefield'){
			if(bArr===true){
				if(arr[$this.name]==undefined){arr[$this.name]=[];}
				arr[$this.name].push($this.val());
				if($this.database != undefined){
					var database=$this.database ;
					if(load != undefined){
						var dis=false;
						$this.setValue(load[database.table][database.field]);
						if(t.database.command[database.table].primary==database.field){$this.disable();dis=true;}
						if(t.database.command[database.table].unique != undefined){
							for(var i=0,iLen=t.database.command[database.table].unique.length;i<iLen;i++){
								if(t.database.command[database.table].unique[i].field==database.field){$this.disable();dis=true;break;}
							}
						}
						if(dis==false && t.q.focusLoad==''){t.q.focusLoad=$this.id;}
					}
					if(t.q.tmp[database.table]== undefined){t.q.tmp[database.table]=[];}
					var dataField={};
					dataField[database.field]={};
					var field=dataField[database.field];
					field['value']=$this.val();
					field['type']='datetime';
					if(database.separator != undefined){field['separator']=database.separator;}
					if(database.primary != undefined && database.primary===true){field['primary']=true;}
					t.q.tmp[database.table].push(dataField);
				}
			}else{
				arr[$this.name] = $this.val();
				if($this.database != undefined){
					var database=$this.database ;
					if(load != undefined){
						var dis=false;
						$this.setValue(load[database.table][database.field]);
						if(t.database.command[database.table].primary==database.field){$this.disable();dis=true;}
						if(t.database.command[database.table].unique != undefined){
							for(var i=0,iLen=t.database.command[database.table].unique.length;i<iLen;i++){
								if(t.database.command[database.table].unique[i].field==database.field){$this.disable();dis=true;break;}
							}
						}
						if(dis==false && t.q.focusLoad==''){t.q.focusLoad=$this.id;}
					}
					if(t.q.tmp[database.table]== undefined){t.q.tmp[database.table]={};}
					t.q.tmp[database.table][database.field]={};
					var field=t.q.tmp[database.table][database.field];
					field['value']=$this.val();
					field['type']='datetime';
					if(database.separator != undefined){field['separator']=database.separator;}
					if(database.primary != undefined && database.primary===true){field['primary']=true;}
				}
			}
			if($this.readOnly===false){if(t.req==true && $this.validate()==false){valid=true;if(t.fReq==true){t.fReq=false;$this.focus();}}}
		} else if(type == 'filefield'||type == 'fotoupload'){
			if(bArr===true){
				if(arr[$this.name]==undefined){arr[$this.name]=[];}
				arr[$this.name].push($this.result);
				if($this.database != undefined){
					var database=$this.database ;
					if(load != undefined){
						var dis=false;
						$this.setFoto(load[database.table][database.field]);
						if(t.database.command[database.table].primary==database.field){$this.disable();dis=true;}
						if(t.database.command[database.table].unique != undefined){
							for(var i=0,iLen=t.database.command[database.table].unique.length;i<iLen;i++){
								if(t.database.command[database.table].unique[i].field==database.field){$this.disable();dis=true;break;}
							}
						}
						if(dis==false && t.q.focusLoad==''){t.q.focusLoad=$this.id;}
					}
					if(t.q.tmp[database.table]== undefined){t.q.tmp[database.table]=[];}
					var dataField={};
					dataField[database.field]={};
					var field=dataField[database.field];
					field['value']=$this.result;
					field['type']='file';
					if(database.type != undefined){field['type']=database.type;}
					if(database.file != undefined){field['file']=database.file;}
					if(database.primary != undefined && database.primary===true){field['primary']=true;};
					t.q.tmp[database.table].push(dataField);
				}
			}else{
				arr[$this.name] = $this.result;
				if($this.database != undefined){
					var database=$this.database ;
					if(load != undefined){
						var dis=false;
						$this.setFoto(load[database.table][database.field]);
						if(t.database.command[database.table].primary==database.field){$this.disable();dis=true;}
						if(t.database.command[database.table].unique != undefined){
							for(var i=0,iLen=t.database.command[database.table].unique.length;i<iLen;i++){
								if(t.database.command[database.table].unique[i].field==database.field){$this.disable();dis=true;break;}
							}
						}
						if(dis==false && t.q.focusLoad==''){t.q.focusLoad=$this.id;}
					}
					if(t.q.tmp[database.table]== undefined){t.q.tmp[database.table]={};}
					t.q.tmp[database.table][database.field]={};
					var field=t.q.tmp[database.table][database.field];
					field['value']=$this.result;
					field['file']='image';
					field['type']='file';
					if(database.type != undefined){field['type']=database.type;}
					if(database.primary != undefined && database.primary===true){field['primary']=true;}
				}
			}
		} else if(type == 'tableeditor' && $this.disabled!= true && $this.hidden==false){
			$this.val(arr,t.q.tmp);
			if($this.database != undefined){var database=$this.database ;if(load != undefined){$this.setVal(load[database.table]);}}
			if(t.fReq==true && t.req==true && $this.check()==false){valid=true;t.fReq=false;}
		}else{
			if ($this.items != undefined && $this.disabled!= true && $this.hidden==false) {
				for (var i = 0,iLen=$this.items.length; i <iLen ; i++) {
					var val=null;
					if($this.items.items!= undefined){val=this.qFinder(arr, $this.items.items[i],load);}else{val=this.qFinder(arr, $this.items[i],load);}
					if(val==true &&  t.req==true){valid=true;}
				}
			}
		}
		return valid;
	},
	qSetForm : function() {
		this.req=false;
		var arr = {};
		this.qFinder(arr, this);
		this.qLastForm = arr;
	},
	qGetForm : function(req) {
		var arr = {};
		if(req != undefined && req==true){this.req=true;this.fReq=true;
		}else{this.req=false;}
		var hasil=this.qFinder(arr, this),sama = true;
		var params = arr,last = this.qLastForm,frm=null;
		for ( var i in last) {
			frm=params[i];
			if (Array.isArray(frm) === false && Array.isArray(last[i]) === false) {if (frm != last[i]) {sama = false;break;}
			} else {
				if (frm.length == undefined && last[i].length == undefined) {sama = false;break;
				} else {
					if (frm.length == last[i].length ) {for (var j = 0,jLen=frm.length; j <jLen ; j++) {if (frm[j] != last[i][j]) {sama = false;break;}}} else {sama = false;break;}
				}
			}
		}
		if(sama==false && hasil==true && this.req==true){sama=null;}
		this.req=false;
		return sama;
	},
	qParams : function() {
		var arr = {};
		this.q.tmp={};
		this.qFinder(arr, this);
		return arr;
	},
	_parameter:function(){
		var arr = {};
		this.q.tmp={};
		this.qFinder(arr, this);
		this.q.tmp['_command']={};
		if(this.database!=undefined){if(this.database.command != undefined){this.q.tmp['_command']=this.database.command;}}
		return JSON.stringify(this.q.tmp);
	},
	_save:function(onSuccess,onError){
		var $this=this;
		Ext.Msg.confirm('Konfirmasi','Apakah Akan Menyimpan Data ini ?',function(answer){
			if(answer=='yes'){
				Ext.Ajax.request({
					url : url + 'fn/transaction/saveTransaction',
					method : 'POST',
					params:{data:$this._parameter()} ,
					before:function(){
						$this.setLoading('Menyimpan Data.');
					},
					success : function(response) {
						$this.setLoading(false);
						var r = ajaxSuccess(response);
						if (r.r == 'S') {if(onSuccess!= undefined)onSuccess(r);}
					},
					failure : function(jqXHR, exception) {
						$this.setLoading(false);
						if(onError!= undefined)onError();
						ajaxError(jqXHR, exception,true);
					}
				});
			}
		});
	},
	_load:function(onSuccess,onError){
		var $this=this;
		Ext.Ajax.request({
			url : url + 'fn/transaction/loadTransaction',
			method : 'POST',
			params:{data:$this._parameter()},
			before:function(){
				$this.setLoading('Mengambil Data.');
			},
			success : function(response) {
				$this.setLoading(false);
				var r = ajaxSuccess(response);
				if (r.r == 'S') {
					$this.qReset();
					var arr = {};
					$this.q.focusLoad='';
					$this.qFinder(arr, $this,r.d);
					$this.qSetForm();
					if(onSuccess!= undefined)onSuccess(r);
					if($this.q.focusLoad !=''){Ext.getCmp($this.q.focusLoad).focus();}
				}
			},
			failure : function(jqXHR, exception) {
				$this.setLoading(false);
				if(onError!= undefined)onError();
				ajaxError(jqXHR, exception,true);
			}
		});
	},
	qReset : function() {this.getForm().reset(true);}
});
//iwindow
Ext.define('IWindow', {
	alias:'widget.iwindow',
	extend : 'Ext.window.Window',
	glyph:'',
	iconCls:'fa fa-desktop',
	constrain : true,
	closeAction : 'hide',
	autoScroll: true,
	resizable : false,
	bodyStyle:'padding-right: -1px;',
	modal : true,
	closing : true,
	q : {type : 'window'},
	full:false,
	layout : 'fit',
	initComponent:function(a){
		var $this=this;
		var listShowOri=null;
		if(this.listeners != undefined && this.listeners.show != undefined){listShowOri=this.listeners.show;}
		if(this.listeners==undefined){this.listeners={};}
		this.listeners.show=function(a) {
			if(listShowOri!=null){listShowOri(a);}
			if (a.qShow != undefined){a.qShow();}
			var size = {
				width: window.innerWidth || document.body.clientWidth,
				height: window.innerHeight || document.body.clientHeight
			};
			if($this.maximized == undefined || $this.maximized==false){
				if(_single_page==false){
					if(Ext.getCmp('west-region-container') != undefined && Ext.getCmp('west-region-container').collapsed===false){$this.maxWidth=size.width-200;}else{$this.maxWidth=size.width-32;}
				}
				if(_single_page==false){
					$this.maxHeight=size.height-100;
					if(Ext.getCmp('header').hidden===true){$this.maxHeight=size.height-30;}
					if(_mobile==true){
						$this.maxHeight=size.height-43;
						$this.maxWidth=size.width-2;
					}
				}
			}
			$('#'+$this.el.id.replace('.','\\.')+'_header-iconEl').replaceWith('<div class="'+$('#'+$this.el.id.replace('.','\\.')+'_header-iconEl').attr('class')+'" id="'+$this.el.id+'_header-iconEl'+'"></div>');
			$this.center();			
		};
		this.listeners.close = function(a) {if (a.qHide != undefined){a.qHide();}};
		this.listeners.beforeclose ={
			fn : function(t) {
				var close = true;
				if (t.qBeforeClose != undefined && t.closing == false){close = t.qBeforeClose();}
				if (close == true && t.closing == true){return true;}else{return false;}
			}
		};
		this.callParent(arguments);
		var size = {
			width: window.innerWidth || document.body.clientWidth,
			height: window.innerHeight || document.body.clientHeight
		};
		if(_mobile==true){
			$this.maxHeight=size.height-30;
			$this.maxWidth=size.width-2;
		};
	},
	qClose : function() {
		this.closing = true;
		this.close();
	}
});
//itable
Ext.define('ITable', {
	alias:'widget.itable',
	extend : 'Ext.grid.Panel',
	pageSize : 25,
	page : 0,
	total : 0,
	totalPage : 0,
	flex : 1,
	plugins: [{
		ptype: 'cellediting',
		clicksToEdit: 1
	}],
	viewConfig:{listeners:{itemkeydown:function(view,record,item,index,e){_ctrl(view.panel,e);}}},
	style:'margin-top: -1px;margin-left: -1px;margin-bottom:-1px;margin-right:-1px;',
	bodyStyle:'padding-right: -1px;',
	border : true,
	hideBbar:false,
	autoRefresh:true,
	columnLines : true,
	store : new Ext.data.ArrayStore({fields : []}),
	dataRow:null,
	getIndexSelect:function(){
		var selectedRecord = this.getSelectionModel().getSelection()[0];
		return this.store.indexOf(selectedRecord);
	},
	getDataSelect:function(){
		return this.store.data.items[this.getIndexSelect()].raw;
	},
	getDataIndex:function(idx){
		return this.store.data.items[idx].raw;
	},
	initComponent : function() {
		var $this = this;
		$this.listeners={
			cellclick : function(view, cell, cellIndex, record, row, rowIndex, e) {
				if($this.onSelect != undefined){$this.onSelect(view, cell, cellIndex, record, row, rowIndex, e);}
				$this.dataRow=record.data;
		    },
			select:function(view, record){
				if($this.onSelect != undefined){$this.onSelect(view, null, null, record, null, null, null);}
				$this.dataRow=record.data;
			},
			itemdblclick:function(view, record){
				if($this.onClick != undefined){$this.onClick(view, null, null, record, null, null, null);}
				$this.dataRow=record.data;
			}
		};
		this.bbar = new Ext.toolbar.Paging({
			store : $this.store,
			displayInfo : true,
			hidden:$this.hideBbar,
			items : [ '-', {xtype : 'displayfield',value : ''
			}, {
				xtype:'idropdown',
				data : [ {id : 1,text : 1}, {id : 5,text : 5}, {id : 10,text : 10}, {id : 25,text : 25}, {id : 50,text : 50}, {id : 100,text : 100}, {id : 200,text : 200} ],
				width : 50,
				value : $this.pageSize,
				listeners:{
					select : function(a) {
						$this.page = 0;
						$this.pageSize = a.getValue();
						$this.refresh();
					}
				}
			}],
			doRefresh : function() {$this.q.sort=undefined;$this.refresh();},
			moveFirst : function() {$this.page = 0;$this.refresh();},
			movePrevious : function() {$this.page -= 1;$this.refresh();},
			moveNext : function() {$this.page += 1;$this.refresh();},
			moveLast : function() {$this.page = $this.totalPage - 1;$this.refresh();},
			onLoad : function(a) {
				var val = parseInt($this.bbar.items.items[4].getValue());
				if (isNaN(val)){$this.page = 0;}else if(val > $this.totalPage){$this.page = $this.totalPage - 1;}
				$this.bbar.items.items[4].on('blur', function() {this.setValue($this.page + 1);});
				$this.refresh();
			}
		});
		this.q = {};
		this.q.bbar = this.bbar;
		if (this.columns != undefined) {
			var fields = [];
			for (var i = 0,iLen=this.columns.length; i < iLen; i++){
				var col=this.columns[i];
				if(col.xtype=='actioncolumn'){
					col.hideable=false;col.menuDisabled=true;col.align= 'center';col.width= 50;col.tooltip=col.text;
				}
				if(col.xtype!=='actioncolumn' && col.xtype!=='rownumberer'  && col.xtype!=='checkcolumn'&& col.renderer == undefined && col.renderer==null){
					col.renderer=function(value,meta,a,b,c,d){
						if(value != undefined && value != null){
							value=value.replace(/</g, "&lt;");
							value=value.replace(/>/g, "&gt;");
						}
						return value;
					}
				}
				if(col.flex != undefined && col.width ==undefined){col.minWidth=200;}
				if(col.xtype=='rownumberer'){col.table=$this;}
				if(col.hidden==true){col.hideable=false;}
				if (col.dataIndex != undefined){fields.push(col.dataIndex);}
			}
			this.store = new Ext.data.ArrayStore({
				fields : fields,
				sort: function(sorters) {if(sorters != undefined){$this.q.sort=sorters;$this.refresh();}}
			});
		}
		this.clear=function(){
			$this.store.loadData([], false);
		};
		this.load = function(bo) {
			var $this = this, a = $this.q.bbar.items.items, to = 0;
			Ext.Ajax.request({
				url : $this.url,
				method : 'GET',
				params:$this.param,
				success : function(response) {
					var r = ajaxSuccess(response);
					if (r.r == 'S') {
						var data = $this.result(r),list = data.list,total = data.total,dataList=$this.store;
						if(list.length<dataList.getRange().length){
							var lebih=dataList.getRange().length-list.length;
							for(var i=0;i<lebih; i++){dataList.removeAt(list.length);}
						}else if(list.length>dataList.getRange().length){
							var lebih=list.length-dataList.getRange().length;
							for(var i=0;i<lebih; i++){dataList.add(list[dataList.getRange().length]);}
						}
						for(var i=0,iLen=list.length;i<iLen;i++){
							var record = dataList.getAt(i);
							var dObj=list[i];
							for(var key in dObj){record.set(key, dObj[key]);}
						}	
						$this.total = total;
						$this.totalPage = Math.ceil(total / $this.pageSize);
						if ($this.page > 0) {a[0].enable();a[1].enable();} else {a[0].disable();a[1].disable();}
						if (($this.page + 1) < $this.totalPage) {a[7].enable();a[8].enable();} else {a[7].disable();a[8].disable();}
						a[4].enable();
						a[4].setValue($this.page + 1);
						a[5].update(' of  ' + $this.totalPage);
						to = (($this.page * $this.pageSize) + $this.pageSize);
						if (to > total){to = total;}
						if(total>$this.pageSize){a[15].update((($this.page * $this.pageSize) + 1) + ' - ' + to+ '/' + total);
						}else if(total > 1){a[15].update((($this.page * $this.pageSize) + 1) + ' - ' + to);
						}else if(total > 0){a[15].update('1 Record');
						}else{a[15].update('No Data');}
					}
				},
				failure : function(jqXHR, exception) {$this.setLoading(false);ajaxError(jqXHR, exception,true);}
			});
		};
		this.refresh = function(bo) {
			var $this = this, a = $this.q.bbar.items.items, to = 0;
			if($this.onNotSelect != undefined){$this.onNotSelect($this);}
			$this.dataRow=null;
			var params={};
			if($this.params != undefined &&(bo== undefined || (bo != undefined && bo == true))){
				if(bo==undefined){bo=true;}
				params=$this.params(bo,$this);
			}else{params=$this.params(false,$this);$this.q.sort=undefined;}
			params['page']=$this.page*$this.pageSize;
			params['pageSize']=$this.pageSize;
			if($this.q.sort != undefined){
				params['s']=$this.q.sort.property;
				params['d']=$this.q.sort.direction;
			}
			$this.param=params;
			$this.store.loadData([], false);
			Ext.Ajax.request({
				url : $this.url,
				method : 'GET',
				params:params,
				before:function(){
					$this.setLoading('Mengambil Data');
				},
				success : function(response) {
					$this.setLoading(false);
					var r = ajaxSuccess(response);
					if (r.r == 'S') {
						var data = $this.result(r),list = data.list,total = data.total;
						$this.store.loadData([], false);
						$this.store.add(list);
						$this.total = total;
						$this.totalPage = Math.ceil(total / $this.pageSize);
						if ($this.page > 0) {a[0].enable();a[1].enable();} else {a[0].disable();a[1].disable();}
						if (($this.page + 1) < $this.totalPage) {a[7].enable();a[8].enable();} else {a[7].disable();a[8].disable();}
						a[4].enable();
						a[4].setValue($this.page + 1);
						a[5].update(' of  ' + $this.totalPage);
						to = (($this.page * $this.pageSize) + $this.pageSize);
						if (to > total){to = total;}
						if(total>$this.pageSize){a[15].update((($this.page * $this.pageSize) + 1) + ' - ' + to+ '/' + total);
						}else if(total > 1){a[15].update((($this.page * $this.pageSize) + 1) + ' - ' + to);
						}else if(total > 0){a[15].update('1 Record');
						}else{a[15].update('No Data');}
						if($this.onAfterRefresh != undefined){$this.onAfterRefresh($this,list);}
					}
				},
				failure : function(jqXHR, exception){$this.setLoading(false);ajaxError(jqXHR, exception,true);}
			});
		};
		this.callParent(arguments);
		if(this.autoRefresh==true){setTimeout(function(){$this.refresh(false);},0);}
	},remove:function(index){
		this.getStore().removeAt(index);
	}
});
//itablegrid
Ext.define('ITableGrid', {
	alias:'widget.itablegrid',
	extend : 'Ext.grid.Panel',
	pageSize : 25,
	page : 0,
	total : 0,
	totalPage : 0,
	flex : 1,
	autoRefresh:true,
	plugins: [{
		ptype: 'cellediting',
		clicksToEdit: 1
	}],
	style:'margin-top: -1px;margin-left: -1px;margin-bottom:-1px;margin-right:-1px;',
	bodyStyle:'padding-right: -1px;',
	border : false,
	columnLines : true,
	hideBbar:false,
	viewConfig:{listeners:{itemkeydown:function(view,record,item,index,e){_ctrl(view.panel,e);}}},
	store : {xtype:'array',fields : []},
	dataRow:null,
	getIndexSelect:function(){
		var selectedRecord = this.getSelectionModel().getSelection()[0];
		return this.store.indexOf(selectedRecord);
	},
	getDataSelect:function(){
		return this.store.data.items[this.getIndexSelect()].raw;
	},
	initComponent : function() {
		var $this = this;
		$this.listeners={
			cellclick : function(view, cell, cellIndex, record, row, rowIndex, e) {
				if($this.onSelect != undefined){$this.onSelect(view, cell, cellIndex, record, row, rowIndex, e);}
				$this.dataRow=record.data;
		    },
			select:function(view, record){
				if($this.onSelect != undefined){$this.onSelect(view, null, null, record, null, null, null);}
				$this.dataRow=record.data;
			},
			itemdblclick:function(view, record){
				if($this.onClick != undefined){$this.onClick(view, null, null, record, null, null, null);}
				$this.dataRow=record.data;
			}
		};
		this.bbar = new Ext.toolbar.Paging({
			store : $this.store,
			displayInfo : true,
			hidden:$this.hideBbar,
			items : [ '-', {
				xtype : 'displayfield',
				value : ''
			},{
				xtype:'idropdown',
				data : [ {id : 1,text : 1}, {id : 5,text : 5}, {id : 10,text : 10}, {id : 25,text : 25}, {id : 50,text : 50}, {id : 100,text : 100}, {id : 200,text : 200} ],
				width : 50,
				value : $this.pageSize,
				listeners:{
					select : function(a) {
						$this.page = 0;
						$this.pageSize = a.getValue();
						$this.refresh();
					}
				}
			} ],
			doRefresh : function() {$this.q.sort=undefined;$this.refresh();},
			moveFirst : function() {$this.page = 0;$this.refresh();},
			movePrevious : function() {$this.page -= 1;$this.refresh();},
			moveNext : function() {$this.page += 1;$this.refresh();},
			moveLast : function() {$this.page = $this.totalPage - 1;$this.refresh();},
			onLoad : function(a) {
				var val = parseInt($this.bbar.items.items[4].getValue());
				if (isNaN(val)){$this.page = 0;}else if(val > $this.totalPage){$this.page = $this.totalPage - 1;}
				$this.bbar.items.items[4].on('blur', function() {this.setValue($this.page + 1);});
				$this.refresh();
			}
		});
		this.q = {};
		this.q.bbar = this.bbar;
		if (this.columns != undefined) {
			var fields = [];
			for (var i = 0,iLen=this.columns.length; i < iLen; i++){
				var col=this.columns[i];
				if(col.xtype=='actioncolumn'){
					col.hideable=false;col.menuDisabled= true;col.align= 'center';col.width= 50;col.tooltip=col.text;
				}
				if(col.xtype!=='actioncolumn' && col.xtype!=='rownumberer'  && col.xtype!=='checkcolumn'&& col.renderer == undefined && col.renderer==null){
					col.renderer=function(value,meta,a,b,c,d){
						if(value != undefined && value != null){
							value=value.replace(/</g, "&lt;");
							value=value.replace(/>/g, "&gt;");
						}
						return value;
					}
				}
				if(col.flex != undefined && col.width ==undefined){col.minWidth=200;}
				if(col.xtype=='rownumberer'){col.table=$this;}
				if(col.hidden==true){col.hideable=false;}
				if (col.dataIndex != undefined){fields.push(col.dataIndex);}
			}
			this.store = new Ext.data.ArrayStore({
				fields : fields,
				sort: function(sorters) {if(sorters != undefined){$this.q.sort=sorters;$this.refresh();}}
			});
		}
		this.excel=function(bo){
			this.refresh(bo);
			window.open(url+'admin/excelTransaction?session='+_session_id+'&sql='+this.database.sqlExcel);
		};
		this.clear=function(){
			$this.store.loadData([], false);
		};
		this.load=function(){
			var $this = this, a = $this.q.bbar.items.items, to = 0;
			Ext.Ajax.request({
				url : url+'admin/listTransaction',
				method : 'GET',
				params:{sql:$this.database.sql,count:$this.database.sqlCount},
				success : function(response) {
					var r = ajaxSuccess(response);
					if (r.r == 'S') {
						var list = r.d,total = r.t,dataList=$this.store;
						if(list.length<dataList.getRange().length){
							var lebih=dataList.getRange().length-list.length;
							for(var i=0;i<lebih; i++){dataList.removeAt(list.length);}
						}else if(list.length>dataList.getRange().length){
							var lebih=list.length-dataList.getRange().length;
							for(var i=0;i<lebih; i++){dataList.add(list[dataList.getRange().length]);}
						}
						for(var i=0,iLen=list.length;i<iLen;i++){
							var record = dataList.getAt(i),dObj=list[i];
							for(var key in dObj){record.set(key, dObj[key]);}
						}
						$this.total = total;
						$this.totalPage = Math.ceil(total / $this.pageSize);
						if ($this.page > 0) {a[0].enable();a[1].enable();
						} else {a[0].disable();a[1].disable();}
						if (($this.page + 1) < $this.totalPage) {a[7].enable();a[8].enable();
						} else {a[7].disable();a[8].disable();}
						a[4].enable();
						a[4].setValue($this.page + 1);
						a[5].update(' of  ' + $this.totalPage);
						to = (($this.page * $this.pageSize) + $this.pageSize);
						if (to > total){to = total;}
						if(total>$this.pageSize){a[15].update((($this.page * $this.pageSize) + 1) + ' - ' + to+ '/' + total);
						}else if(total > 1){a[15].update((($this.page * $this.pageSize) + 1) + ' - ' + to);
						}else if(total > 0){a[15].update('1 Record');
						}else{a[15].update('No Data');}
					}
				},
				failure : function(jqXHR, exception) {
					ajaxError(jqXHR, exception,true);
				}
			});
		};
		this.refresh = function(bo) {
			var $this = this, a = $this.q.bbar.items.items, to = 0;
			if($this.onNotSelect != undefined){$this.onNotSelect($this);}
			$this.dataRow=null;
			
			var params=null;
			if($this.params != undefined &&(bo== undefined || (bo != undefined && bo == true))){
				if(bo==undefined){bo=true;}
				params=$this.params(bo,$this);
			}else{params=$this.params(false,$this);$this.q.sort=undefined;}
			var sql='SELECT ',sqlCount='SELECT ',sqlInner='',sqlSelect='',sqlWhere='',sqlSorting='',strFirst='';
			if(this.database.inner != undefined){sqlInner=this.database.inner;}
			var sort=null;
			if (this.columns != undefined) {
				for (var i = 0,iLen=this.columns.length; i < iLen; i++){
					if(this.columns[i].database!=undefined){
						if(strFirst==''){strFirst=this.columns[i].database.field;}
						if(this.columns[i].sort != undefined && this.columns[i].sort==true){sort=this.columns[i].dataIndex;}
						if(sqlSelect!=''){sqlSelect+=',';}
						sqlSelect+=this.columns[i].database.field;
					}
				}
			}
			if($this.q.sort != undefined){sqlSorting='ORDER BY '+$this.q.sort.property+' '+$this.q.sort.direction;
			}else{if(sort != null){sqlSorting='ORDER BY '+sort+' ASC';}}
			var objCriteria={};
			if(params != null && JSON.parse(params)[$this.database.table] != undefined){objCriteria=JSON.parse(params)[$this.database.table];}
			for (var key in objCriteria) {
				if((objCriteria[key].allow != null && objCriteria[key].allow==true)||(objCriteria[key].value !== '' && objCriteria[key].value != null)){
					if(sqlWhere ==''){sqlWhere+='WHERE ';}else{sqlWhere+='AND ';}
					if(objCriteria[key].type == undefined || objCriteria[key].type=='string'){sqlWhere+='UPPER('+key+')';}else{sqlWhere+=key;}
					if(objCriteria[key].separator != undefined){
						if(objCriteria[key].separator=='like'){sqlWhere+=' like ';
						}else if(objCriteria[key].separator=='<'){sqlWhere+='<';
						}else if(objCriteria[key].separator=='>'){sqlWhere+='>';
						}else if(objCriteria[key].separator=='='){sqlWhere+='=';
						}else if(objCriteria[key].separator=='<='){sqlWhere+='<=';
						}else if(objCriteria[key].separator=='>='){sqlWhere+='>=';
						}else if(objCriteria[key].separator=='<>'){sqlWhere+='<>';
						}else if(objCriteria[key].separator=='is'){sqlWhere+=' is ';
						}else if(objCriteria[key].separator=='in'){sqlWhere+=' in';
						}else if(objCriteria[key].separator=='not in'){sqlWhere+=' not in';}
					}else{sqlWhere+='=';} 
					if(objCriteria[key].type == undefined || objCriteria[key].type=='string' || objCriteria[key].type=='datetime'){
						if(objCriteria[key].separator != undefined && objCriteria[key].separator == 'like'){sqlWhere+="UPPER('%"+ objCriteria[key].value +"%') ";
						}else{sqlWhere+="UPPER('"+ objCriteria[key].value +"') ";}
					}else if(objCriteria[key].type != undefined && objCriteria[key].type=='active'){
						if(objCriteria[key].value=='Y'){sqlWhere+="true ";
						}else{sqlWhere+="false ";}
					}else{sqlWhere+=objCriteria[key].value+" ";}
				}
			}
			sql+=sqlSelect+" FROM "+$this.database.table+" M "+sqlInner+" "+sqlWhere+" "+sqlSorting+"  LIMIT "+$this.pageSize+' OFFSET '+($this.page*$this.pageSize);
			sqlCount+=" COUNT("+strFirst.split(' AS ')[0]+") AS jum FROM "+$this.database.table+" M "+sqlInner+" "+sqlWhere;
			$this.database.sql=sql;
			$this.database.sqlCount=sqlCount;
			$this.database.sqlExcel="SELECT "+sqlSelect+" FROM "+$this.database.table+" M "+sqlInner+" "+sqlWhere+" "+sqlSorting;
			$this.store.loadData([], false);
			Ext.Ajax.request({
				url : url+'fn/transaction/listTransaction',
				method : 'GET',
				params:{sql:sql,count:sqlCount},
				before:function(){
					$this.setLoading(true);
				},
				success : function(response) {
					$this.setLoading(false);
					var r = ajaxSuccess(response);
					if (r.r == 'S') {
						var list = r.d,total = r.t;
						$this.store.loadData([], false);
						$this.store.add(list);
						$this.total = total;
						$this.totalPage = Math.ceil(total / $this.pageSize);
						if ($this.page > 0) {a[0].enable();a[1].enable();} else {a[0].disable();a[1].disable();}
						if (($this.page + 1) < $this.totalPage) {a[7].enable();a[8].enable();} else {a[7].disable();a[8].disable();}
						a[4].enable();
						a[4].setValue($this.page + 1);
						a[5].update(' of  ' + $this.totalPage);
						to = (($this.page * $this.pageSize) + $this.pageSize);
						if (to > total){to = total;}
						if(total>$this.pageSize){a[15].update((($this.page * $this.pageSize) + 1) + ' - ' + to+ '/' + total);
						}else if(total > 1){a[15].update((($this.page * $this.pageSize) + 1) + ' - ' + to);
						}else if(total > 0){a[15].update('1 Record');
						}else{a[15].update('No Data');}
						if($this.onAfterRefresh != undefined){$this.onAfterRefresh($this,list);}
					}
				},
				failure : function(jqXHR, exception) {
					$this.setLoading(false);
					ajaxError(jqXHR, exception,true);
				}
			});
		};
		this.callParent(arguments);
		if(this.autoRefresh==true){setTimeout(function(){$this.refresh(false);},0);}
	},remove:function(index){
		this.getStore().removeAt(index);
	}
});
//iconfirm
Ext.define('IConfirm', {
	alias:'widget.iconfirm',
	extend : 'Ext.window.Window',msg : '',title :'Konfirmasi',constrain : true,bodyStyle : 'background:transparent;',q : {type : 'confirm'},modal : true,als : '',
	closeAction : 'hide',resizable : false,minWidth : 200,maxWidth : 350,autoWidth : true,border : false,allow : [],
	confirm : function(dat) {
		var item=this.items.items[1],datAllow=this.allow[dat.allow];
		item.setValue(false);
		item.hide();
		this.als = '';
		if (dat.msg != undefined){this.items.items[0].items.items[1].setValue(dat.msg);}
		if (dat.onY != undefined){this.onY = dat.onY;}
		if (dat.onN != undefined){this.onN = dat.onN;}
		if (dat.allow != undefined) {
			if (datAllow == undefined){datAllow = false;}
			if (datAllow == false) {
				this.als = dat.allow;
				item.show();
				this.show();
			}else{if(this.onY != undefined){this.close();this.onY();}}
		}else{this.show();}
	},
	listeners : {show : function(a) {a.center();Ext.getCmp(a.id+'btnYes').focus();}},
	initComponent : function() {
		var $this = this;
		$this.items = [
			{
				xtype:'panel',
				bodyStyle : 'background:transparent;',border:false,
				layout : {type : 'hbox',align : 'stretch'},
				items : [
					{ html:'<div class="fa" style="font-family:FontAwesome;font-size:50px !important;">&#xf059;</div>&nbsp;',cls:'i-transparent',border:false
					}, {xtype : 'displayfield',style : 'margin-top:10px;margin-right:10px;',maxWidth : 280,value : $this.msg}
				]
			}, {xtype:'checkbox',style : 'margin-left: 10px;',boxLabel : 'do not ask again.'}
		];
		$this.fbar = [
			{
				xtype:'button',
				id:$this.id+'btnYes',
				text : 'Yes',
				iconCls : 'fa fa-check',
				handler : function() {
					$this.close();
					if ($this.als != '' && $this.items.items[1].getValue() == true){$this.allow[$this.als] = true;}
					if ($this.onY != undefined){$this.onY();}
				}
			},{
				xtype:'button',
				text : 'No',
				iconCls : 'fa fa-close',
				handler : function() {$this.close();if ($this.onN != undefined){$this.onN();}}
			}
		];
		$this.callParent(arguments);
	}
});
//ibuttonfind
_var.ButtonFind={id:null};
Ext.define('IButtonFind', {
	alias:'widget.ibuttonfind',
	extend : 'Ext.Button',
	tooltip:'Search',
	iconCls:'fa fa-search',
	windowWidth:700,
	labelTop:false,
	windowHeight:400,
	window:null,
	windowClose:function(){var $this=this;$this.window.close();},
	refresh:function(){Ext.getCmp(this.id+'_grid').refresh();},
	initComponent:function(){
		if(this.labelTop==true){this.style=iif(_mobile==true,'margin-top: 23px;','margin-top: 20px;');}
		this.callParent(arguments);
	},
	handler:function(a){
		var $this=this;
		_var.ButtonFind.id=$this.id;
		for(var i=0,iLen=$this.items.length; i<iLen; i++){
			$this.items[i].press={};
			$this.items[i].press.enter=function(){Ext.getCmp($this.id+'_grid').refresh();}
		}
		if(Ext.getCmp($this.id+'_window') != undefined){$this.window=Ext.getCmp($this.id+'_window');}
		else{
			var tableType='itablegrid';
			if($this.urlData!=undefined && $this.urlData != ''){tableType='itable';}
			var size = {
				width: window.innerWidth || document.body.clientWidth,
				height: window.innerHeight || document.body.clientHeight
			};
			$this.window=new Ext.Window({
				closeAction:'close',
				modal:true,
				autoScroll: true,
				maxWidth:iif(_mobile==true,size.width,undefined),
				maxHeight:iif(_mobile==true,size.height,undefined),
				id:$this.id+'_window',
				title:'Search',
				listeners:{
					hide:function(){
						shortcut.remove('buttonFind');
						if($this.onHideWindow != undefined){$this.onHideWindow($this,$this.window,Ext.getCmp($this.id+'_grid'),Ext.getCmp($this.id+'_panel'));}
						Ext.getCmp($this.id+'_panel').qReset();
					},show:function(){
						if($this.onBeforeShow != undefined){$this.onBeforeShow($this,$this.window,Ext.getCmp($this.id+'_grid'),Ext.getCmp($this.id+'_panel'));}
					}
				},
				items:[
					{
						xtype:'ipanel',
						width:$this.windowWidth,
						height:$this.windowHeight,
						paddingBottom:false,
						border:false,
						autoScroll: true,
						layout:{type:'vbox',align:'stretch'},
						items:[
							{
								xtype:'ipanel',
								layout:'column',
								id:$this.id+'_panel',
								cls:'i-transparent',
								items:$this.items
							},{
								xtype:tableType,
								flex: 1,
								id:$this.id+'_grid',
								autoRefresh:false,
								url: $this.urlData,
								onAfterRefresh:function(a,b){
									if(b.length>0){a.getSelectionModel().select(0);}
									else{if(Ext.getCmp($this.id+'_panel').items.items[0] != undefined && Ext.getCmp($this.id+'_panel').items.items[0].focus != undefined){Ext.getCmp($this.id+'_panel').items.items[0].focus();}}
								},
								onClick:function(view, a, b, record){if($this.onDblClick != undefined){$this.onDblClick(record.data,$this);}},
								tbar:[
									{
										text:'Search',
										iconCls:'fa fa-search',
										handler:function(){Ext.getCmp($this.id+'_grid').refresh();}
									}
								],
								result:function(response){
									return {list:response.d,total:response.t};
								},
								params:function(bo){
									if($this.urlData!= undefined && $this.urlData !=''){
										return Ext.getCmp($this.id+'_panel').qParams();
									}else{
										if($this.getParameter != undefined){return $this.getParameter();}
										else{return Ext.getCmp($this.id+'_panel')._parameter();}
									}
								},
								database:$this.database,
								fn:{select:function(a){if($this.onEnter != undefined){$this.onEnter(a,$this);}}},
								press:{enter:function(a){Ext.getCmp($this.id+'_grid').fn.select(a.dataRow);}},
								columns:$this.columns
							}
						]
					}
				]
			});
		}
		
		$this.window.show();
		Ext.getCmp($this.id+'_grid').refresh();
		if(Ext.getCmp($this.id+'_panel').items.items[0] != undefined && Ext.getCmp($this.id+'_panel').items.items[0].focus != undefined){Ext.getCmp($this.id+'_panel').items.items[0].focus();}
		shortcut.set({
			code:'buttonFind',
			list:[
				{
					key:'ctrl+f',
					fn:function(){
						if(Ext.getCmp(_var.ButtonFind.id+'_panel').items.items[0] != undefined && Ext.getCmp(_var.ButtonFind.id+'_panel').items.items[0].focus != undefined){
							Ext.getCmp(_var.ButtonFind.id+'_panel').items.items[0].focus();
						}
					}
				}
			]
		});
	}
});
//inumberfield
Ext.define('INumberField', {
	alias:'widget.inumberfield',
	extend: 'Ext.form.TextField',
	margin:true,
	fieldStyle:'text-align: right;',
	property:{type:'numberfield'},
	app:{},
	value:0,
	labelAlign:'right',
	enableKeyEvents:true,
	initComponent:function(){
		var $this=this,prop=$this.app,app={type:'NUMBER',code:'IDR',lang:window.navigator.language,decimal:2},dirty=null;
		for(var index in prop) { app[index] = prop[index]; }
		$this.app=app;
		prop=$this.app;
		if(this.listeners==undefined){this.listeners=[];}
		var blurOri=null;
		if(this.listeners.blur!=undefined){blurOri=this.listeners.blur;}
		var blur=function(textfield,e){
			if(blurOri != null){blurOri(textfield,e);}
			if(prop.blur != undefined){prop.blur(textfield,e);}
			var val=textfield.getValue();
			val=lib.number.formatToNumber(val,prop.lang);
			if(isNaN(val)===true){val=0;}
			var normalVal=val.toLocaleString(prop.lang,{minimumFractionDigits:prop.decimal});
			if(prop.type=='NUMBER'){textfield.setValue(normalVal);
			}else if(prop.type=='CURRENCY'){
				val=val.toLocaleString(prop.lang,{style: 'currency', currency: prop.code,minimumFractionDigits:prop.decimal });
				if(normalVal.substring(0,1)=='-'){textfield.setValue(val.replace(normalVal.substring(1,normalVal.length)," "+normalVal.substring(1,normalVal.length)));
				}else{textfield.setValue(val.replace(normalVal," "+normalVal));}
			}
			if(textfield.user_property!= undefined){
				Ext.Ajax.request({
					url : url + 'admin/setUserProperty',
					method : 'POST',
					params : {code : textfield.user_property.code,name:textfield.user_property.name,value:textfield._getValue()},
					success : function(response) {var r = ajaxSuccess(response);},
					failure : function(jqXHR, exception) {ajaxError(jqXHR, exception);}
				});
			}
		};
		this.listeners.blur=blur;
		var focusOri=null;
		if(this.listeners.focus!=undefined){focusOri=this.listeners.focus;}
		var focus=function(textfield,e){
			if(focusOri != null){focusOri(textfield,e);}
			if(prop.focus != undefined){prop.focus(textfield,e);}
			var val=lib.number.formatToNumber(textfield.getValue(),prop.lang),exNum=1.5;
			exNum=exNum.toLocaleString(prop.lang).toString();
			var desimal=exNum.toString().substring(1,2);
			val=val.toString();
			if(desimal==','){val=val.replace(/\./g,',');}
			if(val==0){textfield.setValue('');}else{textfield.setValue(val);}
		};
		this.listeners.focus=focus;
		//keydown
		var keydownOri=null;
		if(this.listeners.keydown!=undefined){keydownOri=this.listeners.keydown;}
		var keydown=function(textfield,e){
			var keyDecimal=188,exNum=1.5,desimal=exNum.toString().substring(1,2),allow=false;
			exNum=exNum.toLocaleString(prop.lang).toString();
			if(desimal==','){keyDecimal=190;}
			if((e.keyCode>=48&&e.keyCode<=57)||e.keyCode==189||e.keyCode==8||e.keyCode==keyDecimal||e.keyCode==9||e.keyCode==46||e.keyCode==37||e.keyCode==39 || e.keyCode==13){
				allow=true;
				if(e.keyCode==keyDecimal){
					var val=textfield.getValue(),count = val.split('.').length;
					if(desimal==','){count = val.split(',').length;}
					if(val.length>0){if(count>1){e.preventDefault();}}else{e.preventDefault();}
				}	
			}else if((e.keyCode>=65 && e.keyCode<=90) || (e.keyCode>=97 && e.keyCode<=122)){e.preventDefault();}
			if(keydownOri != null){keydownOri(textfield,e);}
			return false;
		};
		this.listeners.keydown=keydown;
		var keypressOri=null;
		if(this.listeners.keypress!=undefined){keypressOri=this.listeners.keypress;}
		var keypress=function(textfield,e){
			if(e.keyCode==13){e.keyCode=9;}
			if(keypressOri != null){keypressOri(textfield,e);}
			return false;
		};
		this.listeners.keypress=keypress;
		var allowBlank='';
		if(this.allowBlank != undefined && this.allowBlank ==false){allowBlank='<span style="color:red;">*</span>';}
		if(this.fieldLabel != undefined && this.fieldLabel !=''){
			if(this.width == undefined && this.anchor==undefined){this.anchor='100%';}
			this.emptyText=this.fieldLabel.replace('<br>','');
			this.fieldLabel='<span style="float:left;text-align:left;">'+this.fieldLabel+allowBlank+'</span>';	
		}
		this.load=function(){
			if($this.user_property!= undefined){
				Ext.Ajax.request({
					url : url + 'admin/getUserProperty',
					method : 'GET',
					params : {code : $this.user_property.code,name:$this.user_property.name},
					success : function(response) {var r = ajaxSuccess(response);if (r.r == 'S'){$this._setValue(r.d);}},
					failure : function(jqXHR, exception) {ajaxError(jqXHR, exception);}
				});
			}
		};
		val=$this.value;
		var exNum=1.5;
		exNum=exNum.toLocaleString(this.app.lang).toString();
		var desimal=exNum.substring(1,2);
		if(desimal==','){val=val.toString().replace(/\./g,',');}
		val=lib.number.formatToNumber(val,this.app.lang);
		var normalVal=val.toLocaleString(this.app.lang,{minimumFractionDigits:this.app.decimal});
		if(this.app.type=='NUMBER'){$this.value=normalVal;
		}else if(this.app.type=='CURRENCY'){
			val=val.toLocaleString(this.app.lang,{style: 'currency', currency: this.app.code,minimumFractionDigits:this.app.decimal });
			if(normalVal.substring(0,1)=='-'){$this.value=val.replace(normalVal.substring(1,normalVal.length)," "+normalVal.substring(1,normalVal.length));
			}else{$this.value=val.replace(normalVal," "+normalVal);}
		}
		
		this.callParent(arguments);
		this.load();
	},
	_setValue:function(val){
		var exNum=1.5;
		exNum=exNum.toLocaleString(this.app.lang).toString();
		var desimal=exNum.substring(1,2);
		if(desimal==','){val=val.toString().replace(/\./g,',');}
		val=lib.number.formatToNumber(val,this.app.lang);
		var normalVal=val.toLocaleString(this.app.lang,{minimumFractionDigits:this.app.decimal});
		if(this.app.type=='NUMBER'){this.setValue(normalVal);
		}else if(this.app.type=='CURRENCY'){
			val=val.toLocaleString(this.app.lang,{style: 'currency', currency: this.app.code,minimumFractionDigits:this.app.decimal });
			if(normalVal.substring(0,1)=='-'){this.setValue(val.replace(normalVal.substring(1,normalVal.length)," "+normalVal.substring(1,normalVal.length)));
			}else{this.setValue(val.replace(normalVal," "+normalVal));}
		}
	},
	_getValue:function(){
		var val=lib.number.formatToNumber(this.getValue(),this.app.lang);
		if(isNaN(val)){return 0;}else{return val;}
	}
});
//iselect
Ext.define('ISelect', {
	alias:'widget.iselect',
	extend: 'Ext.form.Panel',layout:'column',border:false,labelAlign:'right',fieldLabel:'',button:{},forceSelection:true,property:{type:'select'},dynamic:false,valueField:'id',
	textField:'text',showKey:false,readOnly:false,value:null,adaValue:false,noClear:true,textValue:false,cls:'i-transparent',allowBlank : true,margin:false,
	initComponent:function(){
		var cmp=this.items,$this=this, style='',hiddenReset=true,cls='',val=this.value;
		if($this.fieldLabel==''){$this.labelAlign='right';}
		if($this.labelAlign=='top'){this.button.labelTop=true;style+=iif(_mobile==true,'margin-top: 23px;','margin-top: 20px;');}
		if($this.margin!=false){cls=' i-select-no-margin';style='margin-top: 0px !important;';}else{this.bodyStyle='padding-right:4px;';}
		this.button.xtype='ibuttonfind';
		this.button.iconCls='fa fa-search';
		this.button.id=this.id+'-button';
		this.button.tabIndex= -1;
		this.button.hidden=$this.readOnly;
		this.button.style='margin-top: 5px !important;border-radius: 0px !important;border-left:0px !important;'+style;
		this.button.onBeforeShow=function(ini,win,grid,pnl){
			if($this.showKey==true){if(pnl.items.items[0] != undefined && pnl.items.items[0].focus != undefined){pnl.items.items[0].setValue(Ext.getCmp($this.id+'-combo').getRawValue());}}
			if($this.onBeforeShow != undefined){$this.onBeforeShow($this,pnl.items.items);}
		};
		this.getValue=function(){return Ext.getCmp($this.id+'-combo').getValue();};
		this.setReadOnly=function(bool){
			$this.readOnly=bool;
			Ext.getCmp($this.id+'-combo').setReadOnly(bool);
			if(bool==true){Ext.getCmp($this.id+'-button').hide();Ext.getCmp($this.id+'-reset').hide();
			}else{Ext.getCmp($this.id+'-button').show();if(this.getValue() != null && this.getValue()!=''){Ext.getCmp($this.id+'-reset').show();}}
		};
		this.setValue=function(a){
			if(a!= null && a !=''){
				$this.noClear=false;
				if($this.textValue==true){
					if($this.dynamic==true){var val=a.trim().replace(/  +/g, ' ');a=val.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1);});}
					Ext.getCmp($this.id+'-combo').addReset([{id:a,text:a}]);
					Ext.getCmp($this.id+'-combo').setValue(a);
				}else{
					Ext.getCmp($this.id+'-combo').addReset([{id:a[$this.valueField],text:a[$this.textField]}]);
					Ext.getCmp($this.id+'-combo').setValue(a[$this.valueField]);
				}
				$this.noClear=true;
				if($this.readOnly==false){Ext.getCmp($this.id+'-reset').show();}
				$this.adaValue=true;
				if($this.onSelect != undefined){$this.onSelect(a,$this);}
			}else{
				Ext.getCmp($this.id+'-reset').hide();
				Ext.getCmp($this.id+'-combo').addReset([]);
				Ext.getCmp($this.id+'-combo').setValue(null);
				$this.adaValue=false;
			}
		};
		this.focus=function(){Ext.getCmp($this.id+'-combo').focus();};
		this.validate=function(){return Ext.getCmp($this.id+'-combo').validate();};
		this.button.onEnter=function(a){if($this.textValue==true){a=a[$this.valueField];}$this.setValue(a);$this.close();};
		this.button.onDblClick=function(a){if($this.textValue==true){a=a[$this.valueField];}$this.setValue(a);$this.close();};
		this.button.onHideWindow=function(ini,win,grid,pnl){
			setTimeout(function(){
				if($this.showKey==true){
					Ext.getCmp($this.id+'-combo').focus();
				}else{Ext.getCmp($this.id+'-button').focus();}
				$this.showKey=false;
			},200);
		};
		this.refresh=function(){Ext.getCmp($this.id+'-button').refresh();};
		this.close=function(){Ext.getCmp($this.id+'-button').windowClose();};
		if($this.value != null && $this.value !='' && $this.readOnly==false){hiddenReset=false;}
		this.items=[
			{
				xtype:'idropdown',
				cls:'i-select'+cls,
				id:$this.id+'-combo',
				labelAlign:$this.labelAlign,
				columnWidth: 1,
				margin:false,
				name:$this.name,
				database:$this.database,
				forceSelection:$this.forceSelection,
				readOnly:$this.readOnly,
				allowBlank:$this.allowBlank,
				fieldLabel:$this.fieldLabel,
				hideTrigger: true,
				listeners:{
					keydown:function(txt,e){
						if(e.keyCode==13){if($this.adaValue==false){$this.showKey=true;_click($this.id+'-button');}}
						var nav=navigator.platform.match("Mac");
						if (e.keyCode == 68 && ( nav? e.metaKey : e.ctrlKey)){$this.setValue(null);if($this.onReset != undefined){$this.onReset($this);}}
					},
					dirtychange:function(){if($this.adaValue==true && $this.noClear==true){$this.setValue(null);}},
					blur:function(a){if($this.textValue==true)$this.setValue(a.getValue());}
				}
			},{
				xtype:'button',
				iconCls:'fa fa-trash',
				text:'',
				id:$this.id+'-reset',
				tabIndex: -1,
				hidden:hiddenReset,
				style:'margin-top: 5px !important;border-radius: 0px !important;border-left:0px !important;'+style,
				handler:function(){
					$this.setValue(null);
					$this.adaValue=false;
					if($this.onReset != undefined){$this.onReset($this);}
					Ext.getCmp($this.id+'-combo').focus();
				}
			},this.button
		];
		this.callParent(arguments);
		if(val != null){this.setValue(val);}
	}
});
//ilistinput
Ext.define('IListInput', {
	alias:'widget.ilistinput',
	extend:'Ext.Panel',cls:'i-transparent',minHeight:150,addLine:true,paddingBottom:false,property:{},layout:{type:'vbox',align:'stretch'},margin:true,
	initComponent:function(){
		var $this=this,property=this.property,fields=[],database=[];
		this.item=this.items;
		property.type='tableeditor';
		var header=[{xtype:'displayfield',value:'&nbsp;',cls:'x-column-header',width:34,border:false,}];
		var allWidth=true,widthHeader=34,objItem=null;
		for(var i=0,iLen=this.item.length; i<iLen; i++){
			objItem=this.item[i];
			fields.push(objItem.name);
			database.push(objItem.database);
			if(objItem.text != undefined && objItem.text != null && objItem.text != ''){
				var hidden=false,item={xtype:'displayfield'};
				if(objItem.type=='App.cmp.HiddenField' || objItem.type=='IHiddenField' || objItem.xtype=='ihiddenfield' || (objItem.hidden !=undefined && objItem.hidden==true)){item.hidden=true;hidden=true;}
				item.value=objItem.text;
				if(objItem.flex !== undefined && hidden==false){item.flex=objItem.flex;allWidth=false;}
				if(objItem.align !== undefined){item.style='text-align:'+objItem.align+';';item.value+='&nbsp;&nbsp;';}
				if(objItem.width !== undefined && hidden==false){item.width=objItem.width+4;widthHeader+=(objItem.width+4)}
				header.push(item);
			}
		}
		this.fields=fields;
		this.colDatabase=database;
		this.widthHeader=widthHeader;
		this.allWidth=allWidth;
		header.push({xtype:'displayfield',value:'&nbsp;',id:$this.id+'hiddenScroll',width:18,hidden:true});
		var comPanel={xtype:'panel',id:$this.id+'_header',layout:{type:'hbox',align:'stretch'},style:'margin-right:-1px;',height: 42,border:false,items:header,cls:'i-transparent x-column-header',bodyCls:'x-parent-header',autoScroll:true};
		if(allWidth==true){comPanel['width']=widthHeader;}
		this.items=[
			comPanel,
			{xtype:'form',id:$this.id+'_listItem',style:'margin-top:-18px;margin-left:-1px;margin-bottom:-1px;margin-right:-1px;',paddingBottom:false,border:true,flex:1,items:[],autoScroll:true,
				listeners:{
					render: function(p){
						p.body.on('scroll', function(e, t){
							var height = p.getTargetEl().getHeight();
							Ext.getCmp($this.id+'_header').body.dom.scrollLeft = t.scrollLeft;
						}, p);
					}
				}
			},
		];
		this._add=function(stat){
			var item=this.item,listItem=$this.listItem,listItems=listItem.items,panel=null,cls='i-transparent',itm=[];
			if(listItems.length %2 == 0){cls='i-transparent i-table-list-gan'}
			var cmpPanel={
				xtype:'form',cls:cls,paddingBottom:false,width: 2000,layout:{type:'hbox',align:'stretch'},
				style:'padding-top:2px;padding-bottom:2px;',border:false
			};
			if($this.allWidth==true){cmpPanel['width']=$this.widthHeader;}else{cmpPanel['anchor']='100%';}
			itm.push({
				xtype:'button',name:'del',width: 25,margin: "0 4 0 4",iconCls:'fa fa-trash',line:listItems.length-1,tabIndex: -1,
				handler:function(a){$this._remove(a.line);}
			});
			var line=0;
			if($this._getTotal != undefined){line=$this._getTotal();}
			var objItem=null;
			for(var i=0,iLen=item.length;i<iLen;i++){
				objItem=item[i];
				objItem.line=line;
				if(objItem.style==undefined){objItem.style=''}
				objItem.field=true;
				objItem.margin= "0 4 0 0";
				if(objItem.align != undefined){objItem.style+='text-align:'+objItem.align+';';}
				if(objItem.xtype != undefined && objItem.xtype !== '' ){
					if(objItem.xtype=='idynamicoption'){objItem.type=objItem.type_dynamic;}
					itm.push(objItem);
				}else{
					var type=objItem.type;
					if(objItem.type=='App.cmp.DynamicOption' || objItem.type=='IDynamicOption'){
						objItem.type=objItem.type_dynamic;
						objItem.type_component='IDynamicOption';
					}else{if(objItem.type_component != undefined && objItem.type_component != ''){type=objItem.type_component;}}
					itm.push(Ext.create(type,objItem));
				}
			}
			cmpPanel['items']=itm;
			listItem.insert(line,cmpPanel);
			if($this.onAdd != undefined){$this.onAdd($this);}
			if($this.onAddLine != undefined){$this.onAddLine($this);}
			this._onScroll();
		};
		
		this.callParent(arguments);
		this.listItem=Ext.getCmp(this.id+'_listItem');
		this._addAddButton();
		if(this.addLine==true){
			this._add();
		}
	},
	setVal:function(arr){
		this.resetTable();
		var $this=this,item=$this.listItem.items.items;
		for(var i=0,iLen=arr.length;i<iLen; i++){
			if(i !=0){$this._add();}
			var items=item[i].items.items;
			for(var j=0,jLen=items.length;j<jLen; j++){for(var k in arr[i]){if(k==items[j].name){items[j].setValue(arr[i][k]);}}}
		}
	},
	_getTotal:function(){return this.listItem.items.items.length-1;},
	_getValue:function(){
		var $this=this,arr=[],item=$this.listItem.items.items,obj={},items=null,items1=null;
		for(var i=0,iLen=item.length-1;i<iLen;i++){
			items=item[i].items.items;
			obj={};
			for(var j=0,jLen=items.length;j<jLen;j++){
				items1=items[j];
				if(items1.property != undefined && items1.property.type=='numberfield'){
					obj[items1.name]=items1._getValue();
				}else if(items1.property != undefined && items1.property.type=='datefield'){
					obj[items1.name]=items1.val();
				}else{
					if(items1.getValue != undefined && items1.name != undefined){obj[items1.name]=items1.getValue();}
				}
			}
			arr.push(obj);
		}
		return arr;
	},
	val:function(arr,arr2){
		var range=this._getValue(),fields=this.fields,database=this.colDatabase;
		for(var j=0,jLen=fields.length; j<jLen; j++){arr[fields[j]+'[]']=[];}
		for(var i=0,iLen=range.length; i< iLen; i++){
			for(var j=0; j<fields.length; j++){
				arr[fields[j]+'[]'].push(range[i][fields[j]]);
				if(database[j] != undefined){
					var base=database[j] ;
					if(arr2[base.table]== undefined){arr2[base.table]=[];}
					var ada=false;
					for(var k=0,kLen=arr2[base.table].length; k<kLen;k++){
						if(arr2[base.table][k][base.field]==undefined){
							ada=true;
							arr2[base.table][k][base.field]={};
							var field=arr2[base.table][k][base.field];
							field['value']=range[i][fields[j]];
							if(base.type != undefined){field['type']=base.type;}
							if(base.primary != undefined && base.primary===true){field['primary']=true;}
						}
					}
					if(ada==false){
						var dataField={};
						dataField[base.field]={};
						var field=dataField[base.field];
						field['value']=range[i][fields[j]];
						if(base.type != undefined){field['type']=base.type;}
						if(base.primary != undefined && base.primary===true){field['primary']=true;}
						arr2[base.table].push(dataField);
					}
				}
			}
		}
	},
	_remove:function(line){
		var allow=true
		if(this.onBeforeRemove!= undefined){allow=this.onBeforeRemove(this,line);}
		if(allow!==false){
			var $this=this,listItem=$this.listItem,item=listItem.items;itm=item.getAt(line);
			listItem.remove(itm);
			var listItems=item.items;
			for(var i=0,iLen=listItems.length-1;i<iLen;i++){
				var itms=listItems[i];
				itms.removeCls('i-table-list-gan');
				if(i %2 == 0){itms.addCls('i-table-list-gan')}
				var listItem1=itms.items.items;
				for(var j=0,jLen=listItem1.length; j<jLen;j++){listItem1[j].line=i;}
			}
			if(item.length==1){if($this.addLine==true){$this._add();}}
			if(this.onRemove!= undefined){allow=this.onRemove(this);}
		}
		this._onScroll();
	},
	_get:function(name,line){
		var $this=this,item=undefined,items=$this.listItem.items.items[line].items.items;
		for(var i=0,iLen=items.length;i<iLen;i++){if(items[i].name==name){item=items[i];break;}}
		return item;
	},
	_getForm:function(line){return this.listItem.items.items[line];},
	resetTable:function(){var $this=this;$this.listItem.removeAll();$this._addAddButton();
		if($this.addLine==true){
			$this._add();
		}
	this._onScroll();},
	check:function(){
		var allow=true,$this=this,item=$this.listItem.items.items,items=null,items1=null;
		for(var i=0,iLen=item.length;i<iLen;i++){
			items=item[i].items.items;
			for(var j=0,jLen=items.length;j<jLen;j++){
				items1=items[j];
				if(items1.readOnly==undefined ||(items1.readOnly != undefined && items1.readOnly===false)){
					if(items1.validate != undefined){
						if(items1.validate()==false){
							if(items1.focus !=undefined){items1.focus();}
							allow=false;
							break;
						}
					}
				}
			}
		}
		return allow;
	},
	_focus:function(line){
		var allow=true,$this=this,item=$this.listItem.items.items,items=null,items1=null;
		if(line ==undefined){line=item.length-2;}
		items=item[line].items.items;
		for(var j=0,jLen=items.length;j<jLen;j++){
			items1=items[j];
			if(items1.field ===true && (items1.disabled == undefined || (items1.disabled != undefined && items1.disabled ===false))){items1.focus();break;}
		}
		return allow;
	},
	_removeAddButton:function(){
		var $this=this,listItem=$this.listItem,item=listItem.items;itm=item.getAt(listItem.items.length-1);
		listItem.remove(itm);
		this._onScroll();
	},
	_getAddButton:function(){
		var $this=this,listItem=$this.listItem,item=listItem.items;itm=item.getAt(listItem.items.length-1);
		return itm.items.items[0];
	},
	_addAddButton:function(){
		var $this=this,item=this.item,listItem=$this.listItem,listItems=listItem.items;
		listItem.add({xtype:'panel',cls:'i-transparent',anchor:'100%',style:'padding-top:2px;padding-bottom:4px;',border:false,items:[{
			xtype:'button',
			width: 25,margin: "0 0 0 4",iconCls:'fa fa-plus',
			handler:function(){$this._add();$this._focus();}
		}]});
		this._onScroll();
	},
	_onScroll:function(){
		var $this=this,item=this.item,listItem=$this.listItem,listItems=listItem.items;
		if(listItem.body != undefined && listItem.items.items[0].el != undefined){
			var tambahan=0;
			if($this.allWidth==true){tambahan=17};
			if(listItem.body.dom.getBoundingClientRect().height<=(((listItem.items.items[0].el.dom.getBoundingClientRect().height)*(listItems.length))+tambahan)){
				Ext.getCmp($this.id+'hiddenScroll').show();
			}else{Ext.getCmp($this.id+'hiddenScroll').hide();}
		}
	},
});
//idynamicoption
Ext.define('IDynamicOption', {
	alias:'widget.idynamicoption',
	extend:'ISelect',
	allowBlank : false,
	valueField:'text',
	textValue:true,
	dynamic:true,
	forceSelection :false,
	textField:'text',
	button:{},
	initComponent:function(){
		var $this=this,par=null;
		$this.onBeforeShow=function(){if($this.getParent != undefined){par.setValue($this.getParent());}};
		$this.button.windowWidth=350;
		var label='Cari';
		if($this.fieldLabel != undefined && $this.fieldLabel !=''){label=$this.fieldLabel;}
		$this.button.items=[
			{xtype:'itextfield',name:'f1',columnWidth: 1,emptyText:label,database:{table:'app_dynamic_option',field:'M.value',separator:'like'},press:{enter:function(){$this.refresh();}}},
			par=new Ext.create('IHiddenField',{name:'f4',database:{table:'app_dynamic_option',field:'M.parent',}}),
			{xtype:'ihiddenfield',name:'f2',database:{table:'app_dynamic_option',field:'M.option_type',},value:$this.type}
		];
		$this.button.database={table:'app_dynamic_option'};
		$this.button.columns=[
			{ text: label,flex:1, dataIndex: 'value',database:{field:"DISTINCT(CONCAT(M.value,CASE WHEN M.parent IS NOT NULL AND M.parent <>'' AND M.value<>'-' THEN CONCAT(', ',M.parent) ELSE '' END)) AS value"} },
			{ hidden:true,sort:true,dataIndex: 'text',database:{field:'M.value as text'} },
			{
				text: 'Delete',
				xtype: 'actioncolumn',
				iconCls:'fa fa-trash',
				handler: function(grid, rowIndex, colIndex, actionItem, event, record, row) {
					Ext.MessageBox.confirm('Konfirmasi', 'Apakah Akan Hapus Dynamic "'+record.raw.text+'" ?', function(btn){
						if (btn == 'yes'){
							var splitnya=record.raw.value.split(', '),hasil=null;
							if(splitnya.length>1){hasil=splitnya[1];}
							Ext.Ajax.request({
								url : url + 'fn/dynamic_option/deleteDynamic',
								method : 'POST',
								params:{value:record.raw.text,parent:hasil},
								success : function(response) {
									var r = ajaxSuccess(response);
									$this.refresh();
								},
								failure : function(jqXHR, exception) {ajaxError(jqXHR, exception);}
							});
						}
					});
				}
			}
		];
		this.callParent(arguments);
	}
});
//ifotoupload
Ext.define('IFotoUpload', {
	alias:'widget.ifotoupload',
	extend : 'Ext.Panel',
	result:null,
	tempResult:null,
	border:false,
	face:false,
	paddingBottom:false,
	closeAction:'destroy',
	property:{},
	cls:'i-transparent',
	width: 150,
	height: 170,
	input:true,
	html:'<img style="width: 150px;height: 170px;border: 1px solid #99bce8;cursor:pointer;" src="'+url+'upload/NO.GIF"></img>',
	initComponent:function(){
		var property=this.property,btnDeleteImage=null,btnReplaceImage=null;
		property.type='fotoupload';
		disabled=false;
		if(this.input==false){disabled=true;}
		var size = {
				width: window.innerWidth || document.body.clientWidth,
				height: window.innerHeight || document.body.clientHeight
			},
			$this=this,
			panelWindow=new Ext.Panel({html:'<img src="'+url+'upload/NO.GIF"></img>',paddingBottom:false,border:false,}),
			buttonDownload=new Ext.Button({
				tooltip:'Unduh Gambar',
				iconCls:'fa fa-download',
				handler:function(){
					var base64Matcher = new RegExp("^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$"),src='';
					if (base64Matcher.test($this.tempResult)) {src='data:image/png;base64,'+$this.tempResult;} else {src=url+'upload/'+$this.tempResult;}
					window.open(src);
				}
			}),
			windowFoto=new Ext.Window({
				title:'Foto',
				closeAction:'hide',
				modal:true,
				glyph:0xf03e,
				// iconCls:'fa fa-image',
				tbar:[
					btnDeleteImage=new Ext.Button({
						tooltip:'Ganti Gambar',
						iconCls:'fa fa-upload',
						disabled:disabled,
						handler:function(){
							file.fileInputEl.set({accept:'image/*'});
							file.fileInputEl.dom.click();
						}
					}),'-',
					btnReplaceImage=new Ext.Button({
						tooltip:'Hapus Gambar',
						iconCls:'fa fa-trash',
						disabled:disabled,
						handler:function(){
							panelWindow.update('<img src="'+url+'upload/NO.GIF"></img>');
							$this.setNull();
							windowFoto.center();
							buttonDownload.disable();
						}
					}),'-',
					buttonDownload
				],
				items:[panelWindow],
				listeners:{
					show:function(a){
						if($this.input==false){btnDeleteImage.disable();btnReplaceImage.disable();
						}else{btnDeleteImage.enable();btnReplaceImage.enable();}
						if($this.result != null){
							buttonDownload.enable();
							var base64Matcher = new RegExp("^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$"),src='';
							if (base64Matcher.test($this.tempResult)) {src='data:image/png;base64,'+$this.tempResult;
							} else {src=url+'upload/'+$this.tempResult;}
							panelWindow.update('<img style="max-width:'+(size.width-200)+'px;max-height:'+(size.height-200)+'px;"  src="'+src+'"></img>');
						}else{
							buttonDownload.disable();
							panelWindow.update('<img style="max-width:'+(size.width-200)+'px;max-height:'+(size.height-200)+'px;" src="'+url+'upload/NO.GIF"></img>');
						}
						a.center();
					}
				}
			}),
			file=new Ext.form.field.File({
				type : 'filefield',
				hidden:true,
				result:null,
				listeners:{
					change:function(a){
						var file = a.getEl().down('input[type=file]').dom.files[0],
						reader = new FileReader();
						if($this.face==false){
							windowFoto.close();
						}
						reader.onload = (function(theFile) {
							return function(e) {
								if($this.face==true){
									Ext.Ajax.request({
										url : url + 'cmp/cropFaceDetection',
										method : 'POST',
										params:{uri:'data:image/png;base64,'+btoa(e.target.result)},
										before:function(){windowFoto.setLoading(true);},
										success : function(response) {
											windowFoto.setLoading(false);
											var r = ajaxSuccess(response);
											if (r.r == 'S'){
												if($this.face==true){
													windowFoto.close();
												}
												$this.result=r.d;
												$this.tempResult=r.d;
												$this.update('<img style="width: '+($this.width-2)+'px;height: '+($this.height-2)+'px; border: 1px solid #99bce8;cursor:pointer;" src="data:image/png;base64,'+r.d+'"></img>');
												panelWindow.update('<img style="max-width:'+(size.width-50)+'px;max-height:'+(size.height-100)+'px;"  src="data:image/png;base64,'+r.d+'"></img>');
											}
										},
										failure : function(jqXHR, exception){
											windowFoto.setLoading(false);
											ajaxError(jqXHR, exception,true);
										}
									});
								}else{
									$this.result=btoa(e.target.result);
									$this.tempResult=btoa(e.target.result);
									$this.update('<img style="width: '+($this.width-2)+'px;height: '+($this.height-2)+'px; border: 1px solid #99bce8;cursor:pointer;" src="data:image/png;base64,'+btoa(e.target.result)+'"></img>');
									panelWindow.update('<img style="max-width:'+(size.width-50)+'px;max-height:'+(size.height-100)+'px;"  src="data:image/png;base64,'+btoa(e.target.result)+'"></img>');
								}
								windowFoto.center();
								buttonDownload.enable();
							};
						})(file);
						reader.readAsBinaryString(file);
					}
				}
			});
		this.items=[file];
		this.listeners={'render': function(panel) {panel.body.on('click', function(){windowFoto.show();});}};
		this.callParent(arguments);
		if(this.value != undefined){this.setFoto(this.value);}
	},
	setFoto:function(foto){
		var $this=this;
		if(foto != null && foto != ''){
			$this.result=true;
			$this.tempResult=foto;
			var base64Matcher = new RegExp("^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$"),src='';
			if (base64Matcher.test(foto)) {src='data:image/png;base64,'+foto;} else {src=url+'upload/'+foto;}
			$this.update('<img style="width: '+($this.width-2)+'px;height: '+($this.height-2)+'px; border: 1px solid #99bce8;cursor:pointer;" src="'+src+'"></img>');
		}else{$this.setNull();}
	},
	setNull:function(){
		var $this=this;
		$this.result=null;
		$this.tempResult=null;
		$this.update('<img style="width: 150px;height: 170px;border: 1px solid #99bce8;cursor:pointer;" src="'+url+'upload/NO.GIF"></img>');
	}
});
//ibuttonnewtab
Ext.define('IButtonNewTab', {
	alias:'widget.ibuttonnewtab',
	extend : 'Ext.Button',
	tooltip:'Pindah Tab',
	iconCls:'fa fa-window-restore',
	handler:function(){lib.newTabMenu();},
	initComponent:function(a){if(_single_page==true){this.disabled=true;}this.callParent();if(_mobile==true){this.hide();}}

});
//ibuttonfullscreen
Ext.define('IButtonFullScreen', {
	alias:'widget.ibuttonfullscreen',
	extend : 'Ext.Button',
	tooltip:'Full Screen/Not Full Screen <b>[F11]</b>',
	iconCls:'fa-window-maximize',
	allow:false,
	disabled:true,
	handler:function(a){
		var elem=document.body;
		if ((document.fullScreenElement !== undefined && document.fullScreenElement === null) || (document.msFullscreenElement !== undefined && document.msFullscreenElement === null) || (document.mozFullScreen !== undefined && !document.mozFullScreen) || (document.webkitIsFullScreen !== undefined && !document.webkitIsFullScreen)) {
			if (elem.requestFullScreen) {elem.requestFullScreen();
			} else if (elem.mozRequestFullScreen) {elem.mozRequestFullScreen();
			} else if (elem.webkitRequestFullScreen) {elem.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
			} else if (elem.msRequestFullscreen) {elem.msRequestFullscreen();}
			a.setIconCls('fa fa-window-minimize');
		} else {
			if (document.cancelFullScreen) {document.cancelFullScreen();
			} else if (document.mozCancelFullScreen) {ument.mozCancelFullScreen();
			} else if (document.webkitCancelFullScreen) {document.webkitCancelFullScreen();
			} else if (document.msExitFullscreen) {document.msExitFullscreen();}
			a.setIconCls('fa fa-window-maximize');
		}
	},
	initComponent:function(a){
		if(_single_page==true || this.allow==true){this.disabled=false;}
		this.callParent();
		if(_mobile==true){this.hide();}
		if ((document.fullScreenElement !== undefined && document.fullScreenElement === null) || (document.msFullscreenElement !== undefined && document.msFullscreenElement === null) || (document.mozFullScreen !== undefined && !document.mozFullScreen) || (document.webkitIsFullScreen !== undefined && !document.webkitIsFullScreen)) {
			this.setIconCls('fa fa-window-maximize');
		}else{this.setIconCls('fa fa-window-minimize');}
	}
});
//itoast
Ext.define('IToast', {
	alias:'widget.itoast',
	extend:"IWindow",modal:!1,xtype:"toast",isToast:!0,cls:Ext.baseCSSPrefix+"toast",bodyPadding:10,title:"Info",autoClose:!0,plain:!1,draggable:!1,resizable:!1,shadow:!1,focus:Ext.emptyFn,anchor:null,useXAxis:!1,autoHeight:!0,align:"tr",animate:!0,msg:"",spacing:6,paddingX:30,layout:{type:"hbox",align:"stretch"},paddingY:10,slideInAnimation:"easeIn",slideBackAnimation:"bounceOut",slideInDuration:1500,slideBackDuration:1e3,hideDuration:500,autoCloseDelay:3e3,stickOnClick:!0,stickWhileHover:!0,closeOnMouseDown:!1,isHiding:!1,border:!1,isFading:!1,destroyAfterHide:!1,closeOnMouseOut:!1,xPos:0,yPos:0,maxWidth:350,toast:function(i){void 0!=i.msg&&this.items.items[1].setValue(i.msg),void 0!=i.type?"warning"==i.type?(this.title="Peringatan",this.items.items[0].update('<div class="fa" style="font-family:FontAwesome;font-size:50px !important;">&#xf071;</div>&nbsp;')):"error"==i.type?(this.title="Kesalahan",this.items.items[0].update('<div class="fa" style="font-family:FontAwesome;font-size:50px !important;">&#xf057;</div>&nbsp;')):"privilege"==i.type?(this.title="Hak Istimewa",this.items.items[0].update('<div class="fa" style="font-family:FontAwesome;font-size:50px !important;">&#xf091;</div>&nbsp;')):"success"==i.type&&(this.title="Sukses",this.items.items[0].update('<div class="fa" style="font-family:FontAwesome;font-size:50px !important;">&#xf058;</div>&nbsp;')):(this.title="Informasi",this.items.items[0].update('<div class="fa" style="font-family:FontAwesome;font-size:50px !important;">&#xf05a;</div>&nbsp;')),this.show(),this.setHeight(this.items.items[1].getHeight()+60),Ext.WindowManager.bringToFront(this);},initComponent:function(){var i=this;i.items=[{xtype:'panel',html:'<div class="fa" style="font-family:FontAwesome;font-size:50px !important;">&#xf059;</div>&nbsp;',cls:'i-transparent',width: 50,border:false},{xtype:"displayfield",style:"margin-top:5px;margin-right:10px;margin-left:10px;",maxWidth:280,autoHeight:!0,value:i.msg}],i.updateAlignment(i.align),i.setAnchor(i.anchor),i.callParent()},onRender:function(){var i=this;i.callParent(arguments),i.el.hover(i.onMouseEnter,i.onMouseLeave,i),i.closeOnMouseDown&&Ext.getDoc().on("mousedown",i.onDocumentMousedown,i)},alignmentProps:{br:{paddingFactorX:-1,paddingFactorY:-1,siblingAlignment:"br-br",anchorAlign:"tr-br"},bl:{paddingFactorX:1,paddingFactorY:-1,siblingAlignment:"bl-bl",anchorAlign:"tl-bl"},tr:{paddingFactorX:-1,paddingFactorY:1,siblingAlignment:"tr-tr",anchorAlign:"br-tr"},tl:{paddingFactorX:1,paddingFactorY:1,siblingAlignment:"tl-tl",anchorAlign:"bl-tl"},b:{paddingFactorX:0,paddingFactorY:-1,siblingAlignment:"b-b",useXAxis:0,anchorAlign:"t-b"},t:{paddingFactorX:0,paddingFactorY:1,siblingAlignment:"t-t",useXAxis:0,anchorAlign:"b-t"},l:{paddingFactorX:1,paddingFactorY:0,siblingAlignment:"l-l",useXAxis:1,anchorAlign:"r-l"},r:{paddingFactorX:-1,paddingFactorY:0,siblingAlignment:"r-r",useXAxis:1,anchorAlign:"l-r"},x:{br:{anchorAlign:"bl-br"},bl:{anchorAlign:"br-bl"},tr:{anchorAlign:"tl-tr"},tl:{anchorAlign:"tr-tl"}}},updateAlignment:function(i){var t=this,n=t.alignmentProps,e=n[i],o=n.x[i];o&&t.useXAxis&&Ext.applyIf(t,o),Ext.applyIf(t,e)},getXposAlignedToAnchor:function(){var i=this,t=i.align,n=i.anchor,e=n&&n.el,o=i.el,s=0;return e&&e.dom&&(i.useXAxis?"br"===t||"tr"===t||"r"===t?(s+=e.getAnchorXY("r")[0],s-=o.getWidth()+i.paddingX):(s+=e.getAnchorXY("l")[0],s+=i.paddingX):s=o.getLeft()),s},getYposAlignedToAnchor:function(){var i=this,t=i.align,n=i.anchor,e=n&&n.el,o=i.el,s=0;return e&&e.dom&&(i.useXAxis?s=o.getTop():"br"===t||"bl"===t||"b"===t?(s+=e.getAnchorXY("b")[1],s-=o.getHeight()+i.paddingY):(s+=e.getAnchorXY("t")[1],s+=i.paddingY)),s},getXposAlignedToSibling:function(i){var t,n=this,e=n.align,o=n.el;return t=n.useXAxis?"tl"===e||"bl"===e||"l"===e?i.xPos+i.el.getWidth()+i.spacing:i.xPos-o.getWidth()-n.spacing:o.getLeft()},getYposAlignedToSibling:function(i){var t,n=this,e=n.align,o=n.el;return t=n.useXAxis?o.getTop():"tr"===e||"tl"===e||"t"===e?i.yPos+i.el.getHeight()+i.spacing:i.yPos-o.getHeight()-i.spacing},getToasts:function(){var i=this.anchor,t=this.anchorAlign,n=i.activeToasts||(i.activeToasts={});return n[t]||(n[t]=[])},setAnchor:function(i){var t,n=this;n.anchor=i="string"==typeof i?Ext.getCmp(i):i,i||(t=IToast,n.anchor=t.bodyAnchor||(t.bodyAnchor={el:Ext.getBody()}))},beforeShow:function(){var i=this;i.stickOnClick&&i.body.on("click",function(){i.cancelAutoClose()}),i.autoClose&&(i.closeTask||(i.closeTask=new Ext.util.DelayedTask(i.doAutoClose,i)),i.closeTask.delay(i.autoCloseDelay)),i.el.setX(-1e4),i.el.setOpacity(1)},afterShow:function(){var i,t,n,e,o=this,s=o.el;o.callParent(arguments),i=o.getToasts(),n=i.length,t=n&&i[n-1],t?(s.alignTo(t.el,o.siblingAlignment,[0,0]),o.xPos=o.getXposAlignedToSibling(t),o.yPos=o.getYposAlignedToSibling(t)):(s.alignTo(o.anchor.el,o.anchorAlign,[o.paddingX*o.paddingFactorX,o.paddingY*o.paddingFactorY],!1),o.xPos=o.getXposAlignedToAnchor(),o.yPos=o.getYposAlignedToAnchor()),Ext.Array.include(i,o),o.animate?(e=s.getXY(),s.animate({from:{x:e[0],y:e[1]},to:{x:o.xPos,y:o.yPos,opacity:1},easing:o.slideInAnimation,duration:o.slideInDuration,dynamic:!0})):o.setLocalXY(o.xPos,o.yPos)},onDocumentMousedown:function(i){this.isVisible()&&!this.owns(i.getTarget())&&this.hide()},slideBack:function(){var i=this,t=i.anchor,n=t&&t.el,e=i.el,o=i.getToasts(),s=Ext.Array.indexOf(o,i);!i.isHiding&&e&&e.dom&&n&&n.isVisible()&&(s?(i.xPos=i.getXposAlignedToSibling(o[s-1]),i.yPos=i.getYposAlignedToSibling(o[s-1])):(i.xPos=i.getXposAlignedToAnchor(),i.yPos=i.getYposAlignedToAnchor()),i.stopAnimation(),i.animate&&e.animate({to:{x:i.xPos,y:i.yPos},easing:i.slideBackAnimation,duration:i.slideBackDuration,dynamic:!0}))},update:function(){var i=this;i.isVisible()&&(i.isHiding=!0,i.hide()),i.callParent(arguments),i.show()},cancelAutoClose:function(){var i=this.closeTask;i&&i.cancel()},doAutoClose:function(){var i=this;i.stickWhileHover&&i.mouseIsOver?i.closeOnMouseOut=!0:i.close()},onMouseEnter:function(){this.mouseIsOver=!0},onMouseLeave:function(){var i=this;i.mouseIsOver=!1,i.closeOnMouseOut&&(i.closeOnMouseOut=!1,i.close())},removeFromAnchor:function(){var i,t,n=this;if(n.anchor&&(i=n.getToasts(),t=Ext.Array.indexOf(i,n),-1!==t))for(Ext.Array.erase(i,t,1);t<i.length;t++)i[t].slideBack()},getFocusEl:Ext.emptyFn,hide:function(){var i=this,t=i.el;return i.cancelAutoClose(),i.isHiding?i.isFading||(i.callParent(arguments),i.removeFromAnchor(),i.isHiding=!1):(i.isHiding=!0,i.isFading=!0,i.cancelAutoClose(),t&&(i.animate?t.fadeOut({opacity:0,easing:"easeIn",duration:i.hideDuration,listeners:{afteranimate:function(){i.isFading=!1,i.hide(i.animateTarget,i.doClose,i)}}}):(i.isFading=!1,i.hide(i.animateTarget,i.doClose,i)))),i}
});
//iradio
Ext.define('IRadio', {
	alias:'widget.iradio',
	extend:'Ext.form.Radio',
	property:{type:'radio'},
	margin:true,
	labelAlign:'right',
	initComponent:function(){
		var allowBlank='';
		if(this.allowBlank != undefined && this.allowBlank ==false){allowBalnk='<span style="color:red;">*</span>';}
		var labelWidth=95;
		if(this.labelWidth != undefined){labelWidth=this.labelWidth-5;}
		if(this.fieldLabel != undefined && this.fieldLabel !=''){
			if(this.width == undefined && this.anchor==undefined){this.anchor='100%';}
			this.emptyText=this.fieldLabel.replace('<br>','');
			var cssWidth='';
			if(this.labelAlign=='right'){
				cssWidth='width:'+labelWidth+'px;';
			}
			this.fieldLabel='<span style="float:left;text-align:left;text-overflow: ellipsis;white-space: nowrap;overflow: hidden;'+cssWidth+'" title="'+this.fieldLabel+'">'+this.fieldLabel+allowBlank+'</span>';	
		}
		this.callParent(arguments);
	}
});
//ihtmleditor
Ext.define('IHtmlEditor', {
	alias:'widget.ihtmleditor',
	extend : 'Ext.Panel',
	property:{type:'htmleditor',param:0},
	layout:'fit',
	border:false,
	initComponent:function(){
		var $this=this;
		var file=new Ext.form.field.File({
			type : 'filefield',
			hidden:true,
			result:null,
			listeners:{
				change:function(a){
					var file = a.getEl().down('input[type=file]').dom.files[0];
					var reader = new FileReader();
					reader.onload = (function(theFile) {return function(e) {$this.result=btoa(e.target.result);windowFoto.show();style.setValue('');style.focus();};})(file);
					reader.readAsBinaryString(file);
				}
			}
		});
		this.items=[
			{
				xtype: 'tinymce_textarea',
				fieldStyle: 'font-family: Courier New; font-size: 12px;',
				style: { border: '0' },
				id: $this.id+'.htmlEditor',
				height: 'auto',
				id_duplikat:'dawdw',
				openFile:function(){},
				settings:{image_list:'string',id_duplikat:'dawdw',},
				tinyMCEConfig:{
					plugins: [
					"advlist autolink lists link image charmap print preview hr anchor pagebreak","searchreplace wordcount visualblocks visualchars code fullscreen",
					"insertdatetime media nonbreaking save table contextmenu directionality","emoticons template paste textcolor"
					],
					toolbar1: "newdocument fullpage | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | styleselect formatselect fontselect fontsizeselect | cut copy paste | searchreplace | bullist numlist | outdent indent blockquote | undo redo | link unlink anchor image media code | inserttime preview | forecolor backcolor | table | hr removeformat | subscript superscript | charmap emoticons | print fullscreen | ltr rtl | spellchecker | visualchars visualblocks nonbreaking template pagebreak restoredraft",
					content_css : "vendor/tinymce/contents.css",
					relative_urls : false,
					remove_script_host : false,
					document_base_url : url,
					menubar: false,
					templates: [{title: 'Box Code', description: 'Untuk Script HTML', content: "<div style='background-color: #F4F5F7;border: 1px dashed #CCC; padding: 10px; t-align: left;'>&nbsp;</div><br>"},],
					nonbreaking_force_tab:true,
					toolbar_items_size: 'small'
				}
			}
		];
		$this.setValue=function(val){Ext.getCmp($this.id+'.htmlEditor').setValue(val);};
		$this.getValue=function(){return Ext.getCmp($this.id+'.htmlEditor').getValue();};
		this.callParent(arguments);	
	}
});
//ipayment
_var.Payment={id:null};
Ext.define('IPayment', {
	alias:'widget.ipayment',
	extend:'ITable',
	autoRefresh:false,
	minHeight: 150,
	hideBbar:true,
	lunas:false,
	printing:true,
	buy:0,
	params:function(bo,$this){
		var arr={};
		arr['pid']=$this.payment_id;
		return arr;
	},
	url:url + 'cmp/getPaymentList',
	result:function(response){
		return {list:response.d,total:response.t};
	},
	features:[{
		ftype:'summary'
	}],
	initComponent:function(){
		var $this=this;
		_var.Payment.id=$this.id;
		this.pay=function(){
			var size = {
				width: window.innerWidth || document.body.clientWidth,
				height: window.innerHeight || document.body.clientHeight
			};
			var win=new Ext.Window({
				iconCls:'fa fa-money',
				id:$this.id+'window',
				maxWidth:iif(_mobile==true,size.width,undefined),
				maxHeight:iif(_mobile==true,size.height,undefined),
				title:'Bayar',
				modal : true,
				autoScroll:true,
				listeners:{
					show:function(){
						shortcut.set({
							code:'payment',
							list:[
								{key:'ctrl+s',fn:function(){_click(_var.Payment.id+'btnSave');}
								},{key:'esc',fn:function(){_click(_var.Payment.id+'btnClose');}}
							]
						});
					},
					close:function(){shortcut.remove('payment');}
				},
				fbar: [{
					text: 'Bayar',
					id:$this.id+'btnSave',
					tooltip:'Bayar <b>[Ctrl+S]</b>',
					iconCls:'fa fa-money',
					handler: function() {
						var req=Ext.getCmp($this.id+'panel').qGetForm(true);
						if(req == false)
							Ext.Msg.confirm('Konfirmasi', 'Apakah lakukan transaksi ini?', function(answer) {
								if (answer == "yes") {
									var param = Ext.getCmp($this.id+'panel').qParams();
									Ext.Ajax.request({
										url : url + 'cmp/pay',
										method : 'POST',
										params:param,
										before:function(){Ext.getCmp($this.id+'panel').setLoading(true);},
										success : function(response) {
											Ext.getCmp($this.id+'panel').setLoading(false);
											var r = ajaxSuccess(response);
											if (r.r == 'S'){win.close();$this.refresh();}
										},
										failure : function(jqXHR, exception) {
											Ext.getCmp($this.id+'panel').setLoading(false);
											ajaxError(jqXHR, exception);
										}
									});
								}
							});
					}
				},{
					text: 'Close',
					tooltip:'Close <b>[Esc]</b>',
					iconCls:'fa fa-close',
					id:$this.id+'btnClose',
					handler: function(){win.close();}
				}],
				items:[
					{
						xtype:'ipanel',
						id : $this.id+'panel',
						width: 700,
						layout:{type:'vbox',align:'stretch'},
						items:[
							{
								xtype:'form',
								style:'margin-bottom:5px;',
								border:false,
								items:[
									{
										xtype:'ihiddenfield',
										fieldLabel:'No. Faktur',
										name:'payment_id',
										id:$this.id+'i',
									},{
										xtype:'itextfield',
										fieldLabel:'No. Faktur',
										readOnly:true,
										width: 350,
										id:$this.id+'f1',
									},{
										xtype:'idropdown',
										fieldLabel:'Pembayaran',
										width:350,
										allowBlank: false,
										name:'payment_type',
										query:"SELECT payment_type_id AS id, payment_type_name AS text, "+
											"percentage_flag AS f1,percentage AS f2,kredit AS f3,transfer_flag AS f4 "+
											"FROM payment_type WHERE buy_flag="+$this.buy+" AND tenant_id="+_tenant_id+" ORDER BY payment_type_name",
										id:$this.id+'f2',
										listeners:{
											select:function(a){
												if(a.getValue() != null){
													Ext.getCmp($this.id+'list').enable();
													var table=Ext.getCmp($this.id+'list');
													for(var i=0,iLen=table._getTotal(); i<iLen;i++){
														table._get('f3',i)._setValue(a.dataSelect.f2);
														table._get('f4',i)._setValue(((Number(a.dataSelect.f2)/100))*table._get('f2',i)._getValue());
														table._get('f5',i)._setValue(table._get('f2',i)._getValue()-(table._get('f4',i)._getValue()*iif(a.dataSelect.f3==0,-1,1)));
													}
													if(a.dataSelect.f4==1){
														Ext.getCmp($this.id+'f4').setReadOnly(false);
														Ext.getCmp($this.id+'f4').setValue(null);
														Ext.getCmp($this.id+'f5').setValue(null);
														Ext.getCmp($this.id+'f6').setValue(null);
													}else{
														Ext.getCmp($this.id+'f4').setReadOnly(true);
														Ext.getCmp($this.id+'f4').setValue(null);
														Ext.getCmp($this.id+'f5').setValue(null);
														Ext.getCmp($this.id+'f6').setValue(null);
													}
												}
											}
										},
										allowBlank: false
									},{
										xtype:'itextfield',
										fieldLabel:'No. Faktur',
										name:'faktur',
										readOnly:true,
										id_parent:$this.id,
										allowBlank: false,
										listeners:{
											blur:function(a){
												if(a.getValue()!=='' && a.getValue() !== null){
													if(a.getValue() !==Ext.getCmp(a.id_parent+'f1').getValue()){
														Ext.Ajax.request({
															url : url + 'cmp/getByPayCode',
															method : 'GET',
															params:{code:a.getValue()},
															before:function(){Ext.getCmp(a.id_parent+'panel').setLoading(true);},
															success : function(response) {
																Ext.getCmp(a.id_parent+'panel').setLoading(false);
																var r = ajaxSuccess(response);
																if (r.r == 'S'){
																	if($this.cekPartners != undefined && $this.cekPartners(r.d.partners_id)==true){
																		Ext.getCmp(a.id_parent+'f6').setValue(r.d.payment_id);
																		Ext.getCmp(a.id_parent+'f5').setValue(new Date(r.d.tgl));
																	}else{
																		a.setValue('');
																		a.focus();
																		Ext.create('IToast').toast({msg : 'Faktur Tujuan Tidak Sesuai dengan rekanan.',type : 'warning'});
																	}
																}else{
																	a.setValue('');
																	a.focus();
																}
															},
															failure : function(jqXHR, exception) {
																Ext.getCmp(a.id_parent+'panel').setLoading(false);
																a.setValue('');
																a.focus();
																ajaxError(jqXHR, exception);
															}
														});
													}else{
														a.focus();
														Ext.create('IToast').toast({msg : 'Faktur Transfer Tidak Boleh sama dengan faktur pengirim.',type : 'warning'});
													}
												}
											}
										},
										width:350,
										id:$this.id+'f4',
									},{
										xtype:'ihiddenfield',
										id:$this.id+'f6',
										name:'payment_id_transfer',
									},{
										xtype:'idatefield',
										fieldLabel:'Tgl. Faktur',
										readOnly:true,
										// width:350,
										id:$this.id+'f5',
									},{
										xtype:'itextfield',
										fieldLabel:'Detail',
										name:'detail',
										width:350,
										id:$this.id+'f3',
									}
								]
							},{
								xtype:'ilistinput',
								id:$this.id+'list',
								height:200,
								bodyStyle:'margin-left:-1px;margin-right:-1px;',
								margin:false,
								disabled:true,
								name:'options',
								items:[
									{
										xtype:'itextfield',
										name:'f1',
										tabIndex: -1,
										text:'Deskripsi',
										readOnly:true,
										flex:1,
									},{
										xtype:'ihiddenfield',
										name:'i'
									},{
										xtype:'inumberfield',
										tabIndex: -1,
										name:'f2',
										align:'right',
										readOnly:true,
										text:'Piutang',
										app:{type:'CURRENCY',decimal:2},
										width: 120,
									},{
										xtype:'inumberfield',
										name:'f3',
										align:'right',
										text:'(%)',
										app:{decimal:2},
										listeners:{
											blur:function(a){
												var b=Ext.getCmp($this.id+'f2');
												var table=Ext.getCmp($this.id+'list');
												if(table._get('f3',a.line)._getValue()>100){
													table._get('f3',a.line)._setValue(100);
												}
												table._get('f4',a.line)._setValue((table._get('f3',a.line)._getValue()/100)*table._get('f2',a.line)._getValue());
												table._get('f5',a.line)._setValue(table._get('f2',a.line)._getValue()-(table._get('f4',a.line)._getValue()*iif(b.dataSelect.f3==0,-1,1)));
											}
										},
										width: 70,
									},{
										xtype:'inumberfield',
										align:'right',
										allowBlank: false,
										name:'f4',
										text:'Bayar',
										app:{type:'CURRENCY',decimal:2},
										listeners:{
											blur:function(a){
												var b=Ext.getCmp($this.id+'f2');
												var table=Ext.getCmp($this.id+'list');
												if(table._get('f4',a.line)._getValue()>table._get('f2',a.line)._getValue()){
													table._get('f4',a.line)._setValue(table._get('f2',a.line)._getValue());
												}
												table._get('f3',a.line)._setValue((table._get('f4',a.line)._getValue()/table._get('f2',a.line)._getValue())*100);
												table._get('f5',a.line)._setValue(table._get('f2',a.line)._getValue()-(table._get('f4',a.line)._getValue()*iif(b.dataSelect.f3==0,-1,1)));
											}
										},
										width: 120,
									},{
										xtype:'inumberfield',
										align:'right',
										readOnly:true,
										tabIndex: -1,
										name:'f5',
										text:'Sisa',
										app:{type:'CURRENCY',decimal:2},
										width: 120,
									}
								]
							}
						]
					}
				]
			}).show();
			Ext.getCmp($this.id+'panel').qReset();
			Ext.getCmp($this.id+'i').setValue($this.payment_id);
			Ext.getCmp($this.id+'f1').setValue($this.payment_code);
			Ext.Ajax.request({
				url : url + 'cmp/getPaymentDetailList',
				method : 'GET',
				params:{pid:Ext.getCmp($this.id+'i').getValue()},
				before:function(){Ext.getCmp($this.id+'list').setLoading(true);},
				success : function(response) {
					Ext.getCmp($this.id+'list').setLoading(false);
					var r = ajaxSuccess(response);
					var table=Ext.getCmp($this.id+'list');
					table.resetTable();
					if (r.r == 'S') {
						for(var i=0, iLen=r.d.length; i<iLen;i++){
							if(i!=0){table._add();}
							table._get('i',i).setValue(r.d[i].i);
							table._get('f1',i).setValue(r.d[i].f1);
							table._get('f2',i)._setValue(r.d[i].f2);
							table._get('del',i).disable();
						}
						table._getAddButton().disable();
						Ext.getCmp($this.id+'panel').qSetForm();
					}
				},
				failure : function(jqXHR, exception) {
					Ext.getCmp($this.id+'list').setLoading(false);
					ajaxError(jqXHR, exception,true);
				}
			});
			Ext.getCmp($this.id+'panel').qSetForm();
			Ext.getCmp($this.id+'f2').focus();
		};
		this.columns=[
			{ xtype: 'rownumberer'},
			{ hidden:true,dataIndex: 'i' },
			{ text: 'Waktu/Tanggal',width:150,dataIndex: 'f1',align:'center',menuDisabled:true},
			{ text: 'Deskripsi',flex:1,dataIndex: 'f2',menuDisabled:true,renderer: function(value,a){
					if(a.recordIndex>0){return '<div style="float:right;"><b>'+value+'</b></div>';
					}else{return value;}
				},summaryType:function(records,a,b){
					var tLunas='';
					if(records.length>0){
						var sum1=0;
						for(var i=0,iLen=records.length;i<iLen;i++){sum1+=toInt(records[i].data.f3);}
						var sum2=0;
						for(var i=0,iLen=records.length;i<iLen;i++){sum2+=toInt(records[i].data.f4);}
						if(sum1==sum2){
							if($this.initStatus != undefined){$this.initStatus(1);}
							$this.lunas=1;
							tLunas='<div style="margin-right:5px;float:right;background:green;padding-left: 2px;padding-right: 2px;color:white;">BALANCE</div>';
						}else{
							if($this.initStatus != undefined){$this.initStatus(0);}
							$this.lunas=0;
							tLunas='<div style="margin-right:5px;float:right;background:red;padding-left: 2px;padding-right: 2px;color:white;">BELUM BALANCE</div>';
						}
					}else{
						$this.lunas=0;
						if($this.initStatus != undefined){$this.initStatus(null);}
					}
					return '<div style="float:right;"><b>TOTAL Sisa : '+ (sum1-sum2).toLocaleString(window.navigator.language,{minimumFractionDigits:2,style: 'currency', currency:'IDR'}); +'</b></div>'+tLunas;
				}
			},
			{ text: 'Tagihan',width: 120,dataIndex: 'f3',menuDisabled:true,align:'right',xtype:'numbercolumn',
				renderer: function(value,a){
					return Number(value).toLocaleString(window.navigator.language,{minimumFractionDigits:2,style: 'currency', currency:'IDR'});
				},summaryType:function(records){
					var sum=0;
					for(var i=0,iLen=records.length;i<iLen;i++){sum+=toInt(records[i].data.f3);}
					return sum;
				}
			},{ text: 'Pembayaran',width: 120,dataIndex: 'f4',menuDisabled:true,align:'right',xtype:'numbercolumn',
				renderer: function(value,a){
					return Number(value).toLocaleString(window.navigator.language,{minimumFractionDigits:2,style: 'currency', currency:'IDR'});
				} ,summaryType:function(records){
					var sum=0;
					for(var i=0,iLen=records.length;i<iLen;i++){sum+=toInt(records[i].data.f4);}
					return sum;
				}
			},{
				text: 'Detail',
				xtype: 'actioncolumn',
				iconCls: 'fa fa-clipboard',
				isDisabled : function(view, rowIdx, colIdx, item, record) {return iif(rowIdx>0,false,true);},
				handler: function(grid, rowIndex, colIndex, actionItem, event, record, row) {
					if($this.beforeDetail == undefined || 
						($this.beforeDetail != undefined && 
						$this.beforeDetail(grid, rowIndex, colIndex, actionItem, event, record, row)==true)){
						var size = {
							width: window.innerWidth || document.body.clientWidth,
							height: window.innerHeight || document.body.clientHeight
						};
						var win=new Ext.Window({
							id:$this.id+'detail',
							title:'Detail',
							modal : true,
							autoScroll:true,
							maxWidth:iif(_mobile==true,size.width,undefined),
							maxHeight:iif(_mobile==true,size.height,undefined),
							fbar: [{
								text: 'Close',
								iconCls:'fa fa-close',
								id:$this.id+'btnClosedetail',
								handler: function(){win.close();}
							}],
							items:[
								{
									xtype:'panel',
									id : $this.id+'paneldetail',
									width: 400,
									layout:'fit',
									border:false,
									items:[
										{
											xtype:'hiddenfield',
											id : $this.id+'detailId',
										},{
											xtype:'itable',
											height:200,
											features:[{
												ftype:'summary'
											}],
											hideBbar:true,
											autoRefresh:false,
											id : $this.id+'detailList',
											params:function(bo){
												var arr={};
												arr['pid']=Ext.getCmp($this.id+'detailId').getValue();
												return arr;
											},
											url:url + 'cmp/getDetailPayment',
											result:function(response){
												return {list:response.d,total:response.t};
											},
											columns:[
												{ xtype: 'rownumberer'},
												{ text: 'Barang',flex:1,dataIndex: 'f1',summaryType:function(records,a,b){
														return 'TOTAL';
													}
												},{ text: 'Jumlah',width: 150,dataIndex: 'f2',align:'right',xtype:'numbercolumn',
													renderer: function(value,a){
														// value=lib.number.formatToNumber(value,window.navigator.language);
														return Number(value).toLocaleString(window.navigator.language,{minimumFractionDigits:2,style: 'currency', currency:'IDR'});
													} ,summaryType:function(records){
														var sum=0;
														for(var i=0,iLen=records.length;i<iLen;i++){sum+=toInt(records[i].data.f2);}
														return sum;
													}
												}
											]
										}
									]
								}
							]
						}).show();
						Ext.getCmp($this.id+'detailId').setValue(record.data.i);
						Ext.getCmp($this.id+'detailList').refresh();
					}
				}
			},{
				text: 'Print',
				hidden:iif($this.printing==true,false,true),
				xtype: 'actioncolumn',
				iconCls: 'fa fa-print',
				isDisabled : function(view, rowIdx, colIdx, item, record) {return iif(record.raw.f5>0,false,true);},
				handler: function(grid, rowIndex, colIndex, actionItem, event, record, row) {
					if(rowIndex==0){
						if($this.beforeFaktur == undefined || 
						($this.beforeFaktur != undefined && 
						$this.beforeFaktur(grid, rowIndex, colIndex, actionItem, event, record, row)==true)){
							Ext.Msg.confirm('Konfirmasi', 'Apakah akan cetak Faktur?', function(answer) {
								if (answer == "yes") {
									Ext.Ajax.request({
										url : $this.urlFaktur,
										method : 'POST',
										params : {i : record.data.i,file:$this.urlFakturFile,show:$this.fakturPreview,
											pid:$this.payment_id},
										before:function(){$this.setLoading(true);},
										success : function(response) {
											$this.setLoading(false);
											var r = ajaxSuccess(response);
											if (r.r == 'S'){}
										},
										failure : function(jqXHR, exception) {
											$this.setLoading(false);
											ajaxError(jqXHR, exception,true);
										}
									});
								}
							});
							
						}
					}else{
						if($this.beforeKwitansi == undefined || 
						($this.beforeKwitansi != undefined && 
						$this.beforeKwitansi(grid, rowIndex, colIndex, actionItem, event, record, row)==true)){
							Ext.Msg.confirm('Konfirmasi', 'Apakah akan cetak Kwitansi?', function(answer) {
								if (answer == "yes") {
									Ext.Ajax.request({
										url : $this.urlKwitansi,
										method : 'POST',
										params : {i : record.data.i,file:$this.urlKwitansiFile,show:$this.kwitansiPreview,
											pid:$this.payment_id},
										before:function(){$this.setLoading(true);},
										success : function(response) {
											$this.setLoading(false);
											var r = ajaxSuccess(response);
											if (r.r == 'S'){}
										},
										failure : function(jqXHR, exception) {
											$this.setLoading(false);
											ajaxError(jqXHR, exception,true);
										}
									});
								}
							});
							
						}
					}
				}
			},{
				text: 'Hapus',
				xtype: 'actioncolumn',
				iconCls: 'fa fa-trash',
				isDisabled : function(view, rowIdx, colIdx, item, record) {return iif(rowIdx>0,false,true);},
				handler: function(grid, rowIndex, colIndex, actionItem, event, record, row) {
					if($this.beforeDelete == undefined || 
						($this.beforeDelete != undefined && 
						$this.beforeDelete(grid, rowIndex, colIndex, actionItem, event, record, row)==true)){
  						Ext.Msg.confirm('Konfirmasi', 'Apakah hapus pembayaran ini?', function(answer) {
							if (answer == "yes") {
								Ext.Ajax.request({
									url : url + 'cmp/del',
									method : 'POST',
									params : {i : record.data.i},
									before:function(){$this.setLoading(true);},
									success : function(response) {
										$this.setLoading(false);
										var r = ajaxSuccess(response);
										if (r.r == 'S'){$this.refresh();}
									},
									failure : function(jqXHR, exception) {
										$this.setLoading(false);
										ajaxError(jqXHR, exception,true);
									}
								});
							}
						});
					}
				}
			}
		];
		this.callParent(arguments);
	}
});
//isetting
_var.Setting={id:null};
Ext.define('ISetting', {
	alias:'widget.isetting',
	extend:'ITable',
	autoRefresh:false,
	level:0,
	tenant_id:null,
	menu_code:null,
	role_id:null,
	user_id:null,
	code:[],
	setting_list:'',
	params:function(bo,$this){
		var arr={};
		arr['level']=$this.level;
		arr['menu_code']=$this.menu_code;
		arr['tenant_id']=$this.tenant_id;
		arr['role_id']=$this.role_id;
		arr['user_id']=$this.user_id;
		arr['code']=JSON.stringify($this.code);
		return arr;
	},
	url:url + 'cmp/getSettingList',
	result:function(response){
		return {list:response.d,total:response.t};
	},
	initComponent(){
		var $this=this;
		_var.Setting.id=$this.id;
		$this.save=function(level,menu_code,setting_code,value,result,tenant_id,role_id,user_id){
			Ext.Ajax.request({
				url : url + 'cmp/saveSetting',
				method : 'POST',
				params:{
					level:level,menu_code:menu_code,setting_code:setting_code,value:value,
					result:result,tenant_id:tenant_id,role_id:role_id,user_id:user_id
				},
				success : function(response) {
					var r = ajaxSuccess(response);
					if (r.r == 'S'){
						if(_setting[menu_code] != undefined && _setting[menu_code] != null){
							if(_setting[menu_code][setting_code] != undefined){
								_setting[menu_code][setting_code]=r.d;
							}
						}
						
					}
				},
				failure : function(jqXHR, exception) {ajaxError(jqXHR, exception);}
			});
		};
		$this.columns=[
			{ xtype: 'rownumberer'},
			{ hidden:true,dataIndex: 'i' },
			{ hidden:true,dataIndex: 'f3' },
			{ text: 'Setting',width:200,dataIndex: 'f1',menuDisabled:true},
			{ text: 'Value',flex:1,dataIndex: 'f2'},
			{
				text: 'Ubah',
				xtype: 'actioncolumn',
				iconCls: 'fa fa-edit',
				handler: function(grid, rowIndex, colIndex, actionItem, event, record, row) {
					Ext.Ajax.request({
						url : url + 'cmp/initSetting',
						method : 'GET',
						params : {
							level:$this.level,
							menu_code:$this.menu_code,
							tenant_id:$this.tenant_id,
							role_id:$this.role_id,
							user_id:$this.user_id,
							setting_code:record.data.i,
						},
						before:function(){
							grid.setLoading(true);
						},
						success : function(response) {
							grid.setLoading(false);
							var r = ajaxSuccess(response);
							if (r.r == 'S') {
								var d=r.d;
								var input=null;
								if(d.type=='INPUT_TYPE_STRING'){
									input={
										xtype:'itextarea',
										id:$this.id+'input',
										value:d.value,
										fieldLabel:record.data.f1,
										listeners:{
											blur:function(a){
												$this.save($this.level,$this.menu_code,record.data.i,a.getValue(),null,$this.tenant_id,$this.role_id,$this.user_id);
											}
										}
									};
								}else if(d.type=='INPUT_TYPE_PARAM' || d.type=='INPUT_TYPE_YN' ){
									var param='ACTIVE_FLAG';
									if(d.type=='INPUT_TYPE_PARAM'){
										param=d.object;
									}
									input={
										xtype:'idropdown',
										id:$this.id+'input',
										parameter:param,
										value:d.value,
										fieldLabel:record.data.f1,
										listeners:{
											blur:function(a){
												$this.save($this.level,$this.menu_code,record.data.i,a.getValue(),null,$this.tenant_id,$this.role_id,$this.user_id);
											}
										}
									}
								}else if(d.type=='INPUT_TYPE_OBJECTQ'){
									input={
										xtype:'idropdown',
										id:$this.id+'input',
										parameter:'ACTIVE_FLAG',
										value:d.value,
										query:d.object,
										fieldLabel:record.data.f1,
										listeners:{
											blur:function(a){
												$this.save($this.level,$this.menu_code,record.data.i,a.getValue(),null,$this.tenant_id,$this.role_id,$this.user_id);
											}
										}
									}
								}else if(d.type=='INPUT_TYPE_INTEGER' ){
									input={
										xtype:'inumberfield',
										id:$this.id+'input',
										fieldLabel:record.data.f1,
										app:{decimal:2},
										listeners:{
											blur:function(a){
												$this.save($this.level,$this.menu_code,record.data.i,a._getValue(),null,$this.tenant_id,$this.role_id,$this.user_id);
											}
										}
									}
								}else if(d.type=='INPUT_TYPE_DATE' ){
									input={
										xtype:'idatefield',
										id:$this.id+'input',
										fieldLabel:record.data.f1,
										value:d.value,
										listeners:{
											blur:function(a){
												$this.save($this.level,$this.menu_code,record.data.i,a.val(),null,$this.tenant_id,$this.role_id,$this.user_id);
											}
										}
									}
								}
								var size = {
									width: window.innerWidth || document.body.clientWidth,
									height: window.innerHeight || document.body.clientHeight
								};
								var win=new Ext.Window({
									modal:true,
									maxWidth:size.width,
									maxHeight:size.height,
									width: 400,
									title:'Setting',
									layout:'fit',
									listeners:{
										show:function(){
											shortcut.set({
												code:'setting',
												list:[
													{key:'esc',fn:function(){_click(_var.Setting.id+'btnClose');}}
												]
											});
										},
										close:function(){$this.refresh();shortcut.remove('setting');}
									},
									fbar: [{
										text: 'Close',
										id:$this.id+'btnClose',
										tooltip:'Close <b>[Esc]</b>',
										iconCls:'fa fa-close',
										handler: function(){win.close();}
									}],
									items:[
										{
											xtype:'ipanel',
											
											items:[
												input
											]
										}
									]
								}).show();
								if(d.type=='INPUT_TYPE_INTEGER'){
									Ext.getCmp($this.id+'input')._setValue(d.value);
								}
								Ext.getCmp($this.id+'input').focus();
							}
						},
						failure : function(jqXHR, exception) {
							grid.setLoading(false);
							ajaxError(jqXHR, exception,true);
						}
					});
				}
			},{
				text: 'Default',
				xtype: 'actioncolumn',
				iconCls: 'fa fa-clipboard',
				handler: function(grid, rowIndex, colIndex, actionItem, event, record, row) {
					Ext.Msg.confirm('Konfirmasi', 'Apakah akan setting ke default?', function(answer) {
						if (answer == "yes") {
							Ext.Ajax.request({
								url : url + 'cmp/settingDefault',
								method : 'POST',
								params : {
									level:$this.level,
									menu_code:$this.menu_code,
									tenant_id:$this.tenant_id,
									role_id:$this.role_id,
									user_id:$this.user_id,
									setting_code:record.data.i,
								},
								before:function(){$this.setLoading(true);},
								success : function(response) {
									$this.setLoading(false);
									var r = ajaxSuccess(response);
									if (r.r == 'S'){
										$this.refresh();
										if(_setting[$this.menu_code] != undefined && _setting[$this.menu_code] != null){
											if(_setting[$this.menu_code][record.data.i] != undefined){
												_setting[$this.menu_code][record.data.i]=r.d;
											}
										}
									}
								},
								failure : function(jqXHR, exception) {
									$this.setLoading(false);
									ajaxError(jqXHR, exception,true);
								}
							});
						}
					});
				}
			}
		];
		this.callParent(arguments);
	}
});
//iconfig
Ext.define('IConfig', {
	alias:'widget.iconfig',
	extend: 'Ext.Button',
	tooltip:'Config',
	iconCls:'fa fa-cog',
	text:'Config',
	tenant_id:_tenant_id,
	user_id:_user_id,
	role_id:null,
	code:[],
	level:3,
	initComponent:function(){
		var $this=this;
		$this.handler=function(){
			var cmpnya='';
			if($this.menuCode != undefined && $this.menuCode != null && $this.menuCode !=''){
				cmpnya=$this.menuCode;}else{cmpnya=Ext.getCmp(shortcut.getModule()).code;}
			var size = {
				width: window.innerWidth || document.body.clientWidth,
				height: window.innerHeight || document.body.clientHeight
			};
			var win=new Ext.Window({
				iconCls:'fa fa-cog',
				title:'Setting',
				modal:true,
				maxWidth:iif(_mobile==true,size.width,undefined),
				maxHeight:iif(_mobile==true,size.height,undefined),
				resizable:false,
				closeAction:'destroy',
				width: 700,
				fbar: [
					{
						text: 'Keluar',
						tooltip:'Keluar <b>[Esc]</b>',
						iconCls:'fa fa-close',
						handler: function() {
							win.close();
						}
					}
				],
				items:[
					{
						xtype:'ipanel',
						autoScroll: false,
						paddingBottom:false,
						items:[
							{
								xtype:'isetting',
								autoRefresh:true,
								level:$this.level,
								code:$this.code,
								height: 300,
								role_id:$this.role_id,
								menu_code:cmpnya,
								tenant_id:$this.tenant_id,
								user_id:$this.user_id
							}
						]
					}
				]
			}).show();
		};
		this.callParent(arguments);
	}
});
//idisplayfield
Ext.define('IDisplayField', {
	alias:'widget.idisplayfield',
	extend: 'Ext.form.DisplayField',
	property:{},
	press:{},
	event:{},
	margin:true,
	labelAlign:'right',
	initComponent:function(){
		var property=this.property,event=this.event,$this=this;
		property.type='displayfield';
		var labelWidth=95;
		if(this.labelWidth != undefined){labelWidth=this.labelWidth-5;}
		if(this.fieldLabel != undefined && this.fieldLabel !=''){
			if(this.width == undefined && this.anchor==undefined){this.anchor='100%';}
			this.emptyText=this.fieldLabel.replace('<br>','');
			var cssWidth='';
			if(this.labelAlign=='right'){
				cssWidth='width:'+labelWidth+'px;';
			}
			this.fieldLabel='<span style="float:left;text-align:left;text-overflow: ellipsis;white-space: nowrap;overflow: hidden;'+cssWidth+'" title="'+this.fieldLabel+'">'+this.fieldLabel+'</span>';		
		}
		this.callParent(arguments);
	}
});
//ifilemanager
Ext.define('IFileManager', {
	alias:'widget.ifilemanager',
	extend : 'Ext.Panel',
	property:{type:'filemanager'},
	layout:{type:'vbox',align:'stretch'},
	minWidth: 200,
	minHeight:200,
	user:'testing',
	parent:'',
	child:'',
	loadtype:1,
	uploading:false,
	border:false,
	level:0,
	initComponent:function(){
		var $this=this,grid=null,btnUpload=null,file=null,xhr = new XMLHttpRequest(),progress=null,formPanel=null,directory=null;fileName=null;
		$this.getLink=function(){
			var record = grid ? grid.getSelectionModel().getSelection()[0] : null;
			if (!record) {return null;}
			if(record.get('type') != 'FOLDER'){return url+'fn/file?f='+btoa($this.child)+'&n='+record.get('name');}else{return null;}
		};
		var contextMenu = Ext.create('Ext.menu.Menu', {
            width: 200,
            items: [
				{
					text: 'Delete',
					handler: function() {
						var record = grid ? grid.getSelectionModel().getSelection()[0] : null;
						if (!record) {return;}
						Ext.Msg.confirm('Delete Confirm', 'Are you sure for delete this file?', function(answer) {
							if (answer == "yes") {
								grid.setLoading('Delete Folder');
								Ext.Ajax.request({
									url : url + 'fn/file/deleteFile',
									method : 'POST',
									params:{child:$this.child,name:record.get('name')},
									success : function(response) {
										grid.setLoading(false);
										var r = ajaxSuccess(response);
										if (r.r == 'S') {grid.getStore().load({params:{user:$this.user,loadtype:$this.loadtype,parent:$this.parent,child:$this.child}});}
									},
									failure : function(jqXHR, exception) {grid.setLoading(false);ajaxError(jqXHR, exception,true);}
								});
							}
						});
					}
				},{
					text: 'Rename',
					handler: function() {
						var record = grid ? grid.getSelectionModel().getSelection()[0] : null;
						if (!record) {return;}
						Ext.Msg.prompt('Rename', '', function(btn, text){
							if (btn == 'ok'){
								if(text.trim() !=''){
									grid.setLoading('Rename Folder');
									Ext.Ajax.request({
										url : url + 'fn/file/renameFolder',
										method : 'POST',
										params:{child:$this.child,name:text,before:record.get('name')},
										success : function(response) {
											grid.setLoading(false);
											var r = ajaxSuccess(response);
											if (r.r == 'S') {grid.getStore().load({params:{user:$this.user,loadtype:$this.loadtype,parent:$this.parent,child:$this.child}});}
										},
										failure : function(jqXHR, exception) {grid.setLoading(false);ajaxError(jqXHR, exception,true);}
									});
								}
							}
						}, this, false, record.get('name'));
					}
				},{
					text: 'Get Link',
					handler: function() {
						var record = grid ? grid.getSelectionModel().getSelection()[0] : null;
						if (!record) {return;}
						var text=null;
						new Ext.Window({
							layout:'fit',
							title:'Link',
							constrain:true,
							border:false,
							width: 350,
							items:[text=new Ext.form.TextField({selectOnFocus: true,value:url+'fn/file?f='+btoa($this.child)+'&n='+record.get('name')})]
						}).show();
						text.focus();
					}
				}
			]
        });
		$this.abort=function(){
			if($this.uploading==true){
				xhr.abort();
				$this.uploading=false;
				progress.up('panel').hide();
				grid.setLoading(false);
				formPanel.getForm().reset(true);
				grid.getStore().load({params:{user:$this.user,loadtype:$this.loadtype,parent:$this.parent,child:$this.child}});
			}
		};
		$this.items=[
			formPanel=new Ext.form.FormPanel({
				fileUpload : true,
				hidden:true,
				items:[
					directory=new Ext.form.TextField({name:'directory',hidden:true}),
					file=new Ext.form.field.File({
						type : 'filefield',
						hidden:true,
						name:'file',
						result:null,
						listeners:{
							change:function(a){
								$this.uploading=true;
								grid.setLoading(true);
								progress.updateText('Uploading...');
								progress.updateProgress(0);
								progress.up('panel').show();
								var file = a.fileInputEl.dom.files[0];
								xhr = new XMLHttpRequest();
								xhr.addEventListener('progress', function(e) {
									var done = e.position || e.loaded, total = e.totalSize || e.total;
									progress.updateProgress((Math.floor(done/total*1000)/10) / 100);
									progress.updateText((Math.floor(done/total*1000)/10) + '%');
								}, false);
								if ( xhr.upload ) {
									xhr.upload.onprogress = function(e) {
										var done = e.position || e.loaded, total = e.totalSize || e.total;
										progress.updateProgress((Math.floor(done/total*1000)/10) / 100);
										if((Math.floor(done/total*1000)/10)<100){
											progress.updateText((iif((done/1024)>1024,((Math.round(((done/1024)/1024)*10)/10)+' Mb'),(Math.round((done/1024)*10)/10)+' Kb'))+'/'+(Math.round(((total/1024)/1024)*10)/10)+' Mb (' + (Math.floor(done/total*1000)/10) + '%)');
										}else{
											progress.updateText('Finishing...');
										}
									};
								}
								xhr.onreadystatechange = function(e) {
									console.log(this.status);
									if (this.readyState == 4){
										$this.uploading=false;
										progress.up('panel').hide();
										grid.setLoading(false);
										formPanel.getForm().reset(true);
										grid.getStore().load({params:{user:$this.user,loadtype:$this.loadtype,parent:$this.parent,child:$this.child}});
										if(this.status !== 200){//request not initialized
											if(this.status == 0){
												// Ext.create('App.cmp.Toast').toast({msg : 'Batal diUpload.',type : 'error'});
											}else{
												Ext.create('IToast').toast({msg : this.statusText,type : 'error'});
											}
										}else{
											ajaxSuccess(this);
										}
									}
								};
								xhr.open('POST', url + 'fn/file/upload', true);
								var formData = new FormData();
								formData.append("directory", $this.child);
								formData.append("file", file);
								formData.append("session", _session_id);
								xhr.send(formData);
							}
						}
					})
				]
			}),
			grid=new Ext.grid.Panel({
				border: false,
				flex:1,
				viewConfig: {stripeRows: false},
				rowLines : false,
				hideHeaders: true,
				store: Ext.create('Ext.data.Store', {
					autoLoad: false,
					fields: ['parent','child','type','name','id_file'],
					actionMethods: {read: 'GET'},
					proxy: {type: 'ajax',url: url + 'fn/file/getListFile',reader: {type: 'json',root: 'd'}}
				}),
				viewConfig:{listeners:{itemkeydown:function(view,record,item,index,e){
					if(e.keyCode==46){
						var record = grid ? grid.getSelectionModel().getSelection()[0] : null;
						if (!record) {return;}
						if(record.raw.name!=='...' && record.raw.parent !==''){
							Ext.Msg.confirm('Delete Confirm', 'Are you sure for delete this file?', function(answer) {
								if (answer == "yes") {
									grid.setLoading('Delete Folder');
									Ext.Ajax.request({
										url : url + 'fn/file/deleteFile',
										method : 'POST',
										params:{child:$this.child,name:record.get('name')},
										success : function(response) {
											grid.setLoading(false);
											var r = ajaxSuccess(response);
											if (r.r == 'S') {grid.getStore().load({params:{user:$this.user,loadtype:$this.loadtype,parent:$this.parent,child:$this.child}});}
										},
										failure : function(jqXHR, exception) {grid.setLoading(false);ajaxError(jqXHR, exception,true);}
									});
								}
							});
						}
					}else if(e.keyCode==13){
						var ridx=record;
						if(ridx.data.type=='FOLDER'){
							grid.getStore().load({params:{user:$this.user,loadtype:$this.loadtype,child:ridx.data.child,parent:ridx.data.parent},callback:function(){
								$this.parent=ridx.data.parent;
								$this.child=ridx.data.child;
								if(ridx.data.child==''){btnUpload.disable();btnNewFolder.disable();}else{btnUpload.enable();btnNewFolder.enable();}
							}});
						}else{
							Ext.Msg.confirm('Delete Confirm', 'Are you sure for Open/Download this file?', function(answer) {
								if (answer == "yes") {window.open(url+'fn/file?f='+btoa($this.child)+'&n='+ridx.data.name);}
							});
						}
					}
				}}},
				columns: [
					{
						width: 20,
						xtype: 'actioncolumn',
						align: 'right',
						getClass: function(value,metadata,record){
							var type = record.data.type;
								if(type=='FOLDER'){return 'fa fa-folder';
								}else if(type=='TEXT'){return 'fa fa-sticky-note';
								}else if(type=='WORD'){return 'fa fa-file-word-o';
								}else if(type=='EXCEL'){return 'fa fa-file-excel-o';
								}else if(type=='PDF'){return 'fa fa-file-pdf-o';
								}else if(type=='ZIP'){return 'fa fa-file-zip-o';
								}else if(type=='IMAGE'){return 'fa fa-file-photo-o';
								}else if(type=='VIDEO'){return 'fa fa-file-video-o';
								}else if(type=='AUDIO'){return 'fa fa-file-audio-o';
								}else if(type=='APP'){return 'fa fa-windows';
								}else{return 'fa fa-file';}
						}
					},{hidden: true,dataIndex: 'type',
					},{hidden: true,dataIndex: 'child',
					},{hidden: true,dataIndex: 'parent',
					},{hidden: true,dataIndex: 'id_file'
					},{text: "File",flex:1,dataIndex: 'name'}
				],
				listeners:{
					itemdblclick: function (sm, ridx, cidx) {
						if(ridx.data.type=='FOLDER'){
							grid.getStore().load({params:{user:$this.user,loadtype:$this.loadtype,child:ridx.data.child,parent:ridx.data.parent},callback:function(){
								$this.parent=ridx.data.parent;
								$this.child=ridx.data.child;
								if(ridx.data.child==''){btnUpload.disable();btnNewFolder.disable();}else{btnUpload.enable();btnNewFolder.enable();}
							}});
						}else{
							Ext.Msg.confirm('Delete Confirm', 'Are you sure for Open/Download this file?', function(answer) {
								if (answer == "yes") {window.open(url+'fn/file?f='+btoa($this.child)+'&n='+ridx.data.name);}
							});
						}
					}
				},
				tbar:[
					btnUpload=new Ext.Button({
						text:'Upload',
						iconCls:'fa fa-upload',
						disabled:true,
						handler:function(){file.fileInputEl.dom.click();}
					}),
					new Ext.Button({
						text:'Refresh',
						iconCls:'fa fa-refresh',
						handler:function(){grid.getStore().load({params:{user:$this.user,loadtype:$this.loadtype,parent:$this.parent,child:$this.child}});}
					}),
					btnNewFolder=new Ext.Button({
						text:'New Folder',
						iconCls:'fa fa-folder',
						disabled:true,
						handler:function(){
							Ext.Msg.prompt('New Folder', 'Enter Folder Name:', function(btn, text){
								if (btn == 'ok'){
									if(text.trim() !=''){
										grid.setLoading('Create Folder');
										Ext.Ajax.request({
											url : url + 'fn/file/newFolder',
											method : 'POST',
											params:{child:$this.child,name:text},
											success : function(response) {
												grid.setLoading(false);
												var r = ajaxSuccess(response);
												if (r.r == 'S') {grid.getStore().load({params:{user:$this.user,loadtype:$this.loadtype,parent:$this.parent,child:$this.child}});}
											},
											failure : function(jqXHR, exception) {grid.setLoading(false);ajaxError(jqXHR, exception,true);}
										});
									}
								}
							});
						}
					})
				]
			}),{
				xtype:'panel',
				height: 20,
				border:false,
				hidden:true,
				layout:{
					type:'hbox',
					align:'stretch'
				},
				items:[
					progress=Ext.create('Ext.ProgressBar', {
						text: 'Uploading...',
						border:false,
						flex:1,
					}),{
						xtype:'button',
						iconCls:'fa fa-close',
						handler:function(){
							$this.abort();
						}
					}
				]
			}
			
		];
		grid.on("itemcontextmenu", function(grid, record, item, index, e) {
            e.stopEvent();
			if(record.data.parent==''){
				contextMenu.items.items[0].disable();
				contextMenu.items.items[1].disable();
				contextMenu.items.items[2].disable();
			}else{
				contextMenu.items.items[0].enable();
				contextMenu.items.items[1].enable();
				contextMenu.items.items[2].enable();
				if(record.data.type=='FOLDER'){contextMenu.items.items[2].disable();}
			}
            contextMenu.showAt(e.getXY());
        });
		this.callParent(arguments);
		grid.getStore().load({params:{user:$this.user,loadtype:$this.loadtype,parent:$this.parent,child:$this.child}});
	}
});
//isession
Ext.define('ISession', {
	extend : 'Ext.Window',
	title : 'Login - Session Has Expired.',
	closable : false,
	id:'session',
	modal : true,
	iconCls: 'fa fa-user',
	closeAction:'destroy',
	fbar: [{
		text: 'Login',
		iconCls:'fa fa-user',
		id:'a8.input.btnLogin',
		handler: function() {
			var param={username:Ext.getCmp('session.f1').getValue(),password:Ext.getCmp('session.f2').getValue()};
			Ext.getCmp('session').setLoading('Check Login');
			Ext.Ajax.request({
				url : url + 'fn/login/login',
				method : 'POST',
				params:param,
				success : function(response) {
					Ext.getCmp('session').setLoading(false);
					var r = ajaxSuccess(response);
					if (r.r == 'S') {
						if(_user_code != Ext.getCmp('session.f1').getValue()){location.replace(url+'cpanel?session='+r.d);}
						storage_auth();
						_session_id=r.d;
						window.history.pushState({canBeAnything:true},"Ayam",url+'cpanel?session='+r.d);
						Ext.getCmp('session').close();
						for(var i=0,iLen=_listAjaxSession.length; i<iLen;i++){Ext.Ajax.request(_listAjaxSession[i].request.options);}
						_listAjaxSession=[];
						_execAjaxSession=false;
					}
				},
				failure : function(jqXHR, exception) {
					Ext.getCmp('session').setLoading(false);
					ajaxError(jqXHR, exception);
				}
			});
		}
	},{
		text: 'Halaman Login',
		iconCls:'fa fa-file-o',
		handler: function() {Ext.getCmp('main.confirm').confirm({msg : 'Apakah Kamu Ingin Ke Halaman Login?',onY : function(){location.replace(url+'admin');}});}
	}],
	initComponent:function(){
		var $this=this;
		$this.items=[
			Ext.create('IPanel',{
				bodyStyle : 'padding: 5px 10px',
				width: 350,
				items:[
					{
						xtype:'itextfield',
						fieldLabel:'Username',
						id:'session.f1',
						press:{enter:function(){_click('a8.input.btnLogin');}},
						allowBlank: false
					},{
						xtype:'itextfield',
						fieldLabel:'Password',
						inputType: 'password' ,
						press:{enter:function(){_click('a8.input.btnLogin');}},
						id:'session.f2',
						allowBlank: false
					}
				]
			})
		];
		$this.callParent();
	}
});