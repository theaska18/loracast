//idropdown
Ext.define('IDropDown', {
	alias:'widget.idropdown',
	extend:'Ext.form.ComboBox',store: {xtype:'array'},queryMode: 'local',property:{},press:{},event:{},forceSelection :true,displayField: 'text',valueField: 'id',
	rawField:'text',emptyText:'Pilih -',enableKeyEvents:true,listeners:{},margin:true,labelAlign:'right',dataSelect:{},
	load:function(query,rest){
		var $this=this;
		if(rest==undefined){rest=false}
		if(query != undefined && query !=''){$this.query=query;}
		if($this.parameter != undefined && $this.parameter!=='' && (query == undefined || query=='')){
			var tmpParam=localStorage.getItem('PARAMETER.'+$this.parameter);
			if(tmpParam == undefined || tmpParam==null || tmpParam=='' || rest==true){
				Ext.Ajax.request({
					url : url+'fn/parameter/getParameter',
					method : 'GET',
					params:{param:$this.parameter},
					success : function(response) {
						var r = ajaxSuccess(response);
						if (r.r == 'S') {$this.addReset(r.d);localStorage.setItem('PARAMETER.'+$this.parameter,JSON.stringify(r.d));}
					},failure : function(jqXHR, exception) {ajaxError(jqXHR, exception,true);}
				});
			}else{$this.addReset(JSON.parse(tmpParam));}
		}
		if($this.query != undefined && $this.query!=''){
			var tmpParam=localStorage.getItem('QUERY.'+$this.query);
			if(tmpParam == undefined || tmpParam==null || tmpParam=='' || rest==true){
				Ext.Ajax.request({
					url : url+'fn/parameter/getParameter',
					method : 'GET',
					params:{query:$this.query},
					success : function(response) {
						var r = ajaxSuccess(response);
						if (r.r == 'S') {$this.addReset(r.d);localStorage.setItem('QUERY.'+$this.query,JSON.stringify(r.d));}},
					failure : function(jqXHR, exception) {ajaxError(jqXHR, exception,true);}
				});
			}else{$this.addReset(JSON.parse(tmpParam));}
		}
		if($this.url != undefined){
			Ext.Ajax.request({
				url : $this.url,
				method : 'GET',
				success : function(response) {var r = ajaxSuccess(response);if (r.r == 'S') {$this.addReset(r.d);}},
				failure : function(jqXHR, exception) {ajaxError(jqXHR, exception,true);}
			});
		}
		if($this.printer != undefined){
			var tmpParam=localStorage.getItem('PRINTER');
			if(tmpParam == undefined || tmpParam==null || tmpParam=='' || rest==true){
				findPrinters(function(data){
					if(data != undefined && data!= null){
						var dataArr=[];
						for(var i=0,iLen=data.length;i<iLen;i++){
							dataArr.push({id:data[i],text:data[i]});
						}
						localStorage.setItem('PRINTER',JSON.stringify(dataArr));
						$this.addReset(dataArr);
						if($this.value !=undefined){
							$this.setValue($this.value);
						}
					}
				});
			}else{
				$this.addReset(JSON.parse(tmpParam));
				if($this.value !=undefined){
					$this.setValue($this.value);
				}
			}
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
			if (e.keyCode == 68 && ( nav? e.metaKey : e.ctrlKey)){textfield.setValue(null);$this.load('',true);e.preventDefault();}
			
			return false;
		};
		this.listeners.keydown=keydown;
		//keyup
		var keyupOri=null;
		if(this.listeners.keyup!=undefined){keyupOri=this.listeners.keyup;}
		var keyup=function(textfield,e){
			if(keyupOri != null){keyupOri(textfield,e);}
			_ctrl(textfield,e);
			if(e.keyCode==13){
				if(!textfield.isExpanded){
					nextFocus(textfield,e);	
				}
			}
			return false;
		};
		this.listeners.keyup=keyup;
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
		if(this.note != undefined && this.note !=''){
			this.on({
				afterrender:this.calculate,
				scope:this
			});
		}
		this.callParent(arguments);
		this.load();
	},
	calculate:function(textfield,e){
		var me=this,
			span=Ext.dom.Query.select('input',me.getEl().dom)[0];
		var newEl=document.createElement('td');
		newEl.innerHTML='&nbsp;<span class="fa fa-info-circle" title="'+me.note+'"></span>';
		newEl.style.width='20px';
		if(me.labelAlign=='top'){
			newEl.style['padding-top']='13px';
		}
		span.parentNode.parentNode.append(newEl);
	},
	setVal:function(val){this.setValue(val);if (this.valueModels[0] != undefined){this.setRawValue(this.valueModels[0].data[this.rawField]);}},
	addData:function(data){this.store.add(data);},
	setQuery:function(query,val,callback){
		var $this=this;
		$this.query=query;
		var tmpParam=localStorage.getItem('QUERY.'+$this.query);
		if(tmpParam == undefined || tmpParam==null || tmpParam==''){
			Ext.Ajax.request({
				url : url+'fn/parameter/getParameter',
				method : 'GET',
				params:{query:$this.query},
				before:function(){$this.disable();},
				success : function(response) {
					$this.enable();
					var r = ajaxSuccess(response);
					if (r.r == 'S') {
						localStorage.setItem('QUERY.'+$this.query,JSON.stringify(r.d));
						$this.addReset(r.d);if(val != undefined){$this.setValue(val);}if(callback != undefined){callback($this);}}
				},
				failure : function(jqXHR, exception) {$this.enable();ajaxError(jqXHR, exception,true);}
			});
		}else{$this.addReset(JSON.parse(tmpParam));if(val != undefined){$this.setValue(val);}if(callback != undefined){callback($this);}}
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