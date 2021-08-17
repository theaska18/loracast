Ext.define('ITimeField', {
	alias:'widget.itimefield',
	extend: 'Ext.form.TimeField',
	property:{},
	event:{},
	format:'H:i',
	enableKeyEvents:true,
	margin:true,
	labelAlign:'right',
	setNum:function(a,num){
		function checkValid(dat){
			var isValid = /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/.test(dat);
			if (isValid) {
				return true;
			}else{
				return false;
			}
		}
		var pos=a.getPosition();
		if(a.val()==''){
			a.setValue(new Date());
			a.setPosition(pos);
		}
		if(pos==0){
			if(checkValid(num+a.val().substring(1,5)+':00')==true){
				a.setValue(num+a.val().substring(1,5));
				a.setPosition(pos+1);
			}
		}else if(pos==1){
			if(checkValid(a.val().substring(0,1)+num+a.val().substring(2,5)+':00')==true){
				a.setValue(a.val().substring(0,1)+num+a.val().substring(2,5));
				a.setPosition(pos+2);
			}
		}else if(pos==3){
			if(checkValid(a.val().substring(0,3)+num+a.val().substring(4,5)+':00')==true){
				a.setValue(a.val().substring(0,3)+num+a.val().substring(4,5));
				a.setPosition(pos+1);
			}
		}else if(pos==4){
			if(checkValid(a.val().substring(0,4)+num+':00')==true){
				a.setValue(a.val().substring(0,4)+num);
				a.setPosition(pos+1);
			}
		}
	},
	getPosition:function() {
		var me=this;
    	var el = document.getElementById(me.id+'-inputEl');
    	   var rng, ii=-1;
		if(typeof el.selectionStart=="number") {
			ii=el.selectionStart;
		} else if (document.selection && el.createTextRange){
			rng=document.selection.createRange();
			rng.collapse(true);
			rng.moveStart("character", -el.value.length);
			ii=rng.text.length;
		}
		return ii;
    },
	setPosition:function(pos){
		var me=this;
		var obj = document.getElementById(me.id+'-inputEl');
		obj.focus(); 
		obj.setSelectionRange(pos, pos); 
	},
	onDownArrow: Ext.emptyFn,
	initComponent:function(){
		var property=this.property,event=this.event,$this=this,listeners={};
		property.type='timefield';
		//blur
		var blurOri=null;
		if(listeners.blur!=undefined){blurOri=listeners.blur;}
		var blur=function(textfield,e){
			if(blurOri != null){blurOri(textfield,e);}
			if(event.blur != undefined){event.blur(textfield,e);}
		};
		listeners.blur=blur;
		//focus
		var focusOri=null;
		if(listeners.focus!=undefined){focusOri=listeners.focus;}
		var focus=function(textfield,e){if(focusOri != null){focusOri(textfield,e);}if(event.focus != undefined){event.focus(textfield,e);}};
		listeners.focus=focus;
		//keyup
		var keyupOri=null;
		if(this.listeners.keyup!=undefined){keyupOri=this.listeners.keyup;}
		var keyup=function(textfield,e){
			if(keyupOri != null){keyupOri(textfield,e);}
			_ctrl(textfield,e);
			if(e.keyCode==13){
				nextFocus(textfield,e);		
			}
			return false;
		};
		listeners.keyup=keyup;
		//keydown
		var keydownOri=null;
		if(listeners.keydown!=undefined){keydownOri=listeners.keydown;}
		var keydown=function(textfield,e){
			if(keydownOri != null){keydownOri(textfield,e);}
			_ctrl(textfield,e);
			var nav=navigator.platform.match("Mac");
			if(e.keyCode==40){
				if(textfield.val()==''){
					textfield.setValue(new Date());
					textfield.setPosition(0);
				}else{
					var pos=textfield.getPosition();
					if(pos>=0 && pos<=2){
						textfield.setValue(Ext.Date.add (new Date('1970-01-01 '+textfield.val()+':00'),Ext.Date.HOUR,-1));
					}else if(pos>=3 && pos<=5){
						textfield.setValue(Ext.Date.add (new Date('1970-01-01 '+textfield.val()+':00'),Ext.Date.MINUTE,-1));
					}
					textfield.setPosition(pos);
				}
			}else if(e.keyCode==38){
				if(textfield.val()==''){
					textfield.setValue(new Date());
					textfield.setPosition(0);
				}else{
					var pos=textfield.getPosition();
					if(pos>=0 && pos<=2){
						textfield.setValue(Ext.Date.add (new Date('1970-01-01 '+textfield.val()+':00'),Ext.Date.HOUR,1));
					}else if(pos>=3 && pos<=5){
						textfield.setValue(Ext.Date.add (new Date('1970-01-01 '+textfield.val()+':00'),Ext.Date.MINUTE,1));
					}
					textfield.setPosition(pos);
				}
			}else if(e.keyCode==48){textfield.setNum(textfield,0);e.preventDefault();
			}else if(e.keyCode==49){textfield.setNum(textfield,1);e.preventDefault();
			}else if(e.keyCode==50){textfield.setNum(textfield,2);e.preventDefault();
			}else if(e.keyCode==51){textfield.setNum(textfield,3);e.preventDefault();
			}else if(e.keyCode==52){textfield.setNum(textfield,4);e.preventDefault();
			}else if(e.keyCode==53){textfield.setNum(textfield,5);e.preventDefault();
			}else if(e.keyCode==54){textfield.setNum(textfield,6);e.preventDefault();
			}else if(e.keyCode==55){textfield.setNum(textfield,7);e.preventDefault();
			}else if(e.keyCode==56){textfield.setNum(textfield,8);e.preventDefault();
			}else if(e.keyCode==57){textfield.setNum(textfield,9);e.preventDefault();
			}else if(e.keyCode==8){
				if(textfield.val()!==''){
					var pos=textfield.getPosition();
					if(pos==1 || pos==2|| pos==4|| pos==5){
						textfield.setPosition(pos-1);
					}else if(pos==3){
						textfield.setPosition(pos-2);
					}
				}
				e.preventDefault();
			}else if (e.keyCode == 68 && ( nav? e.metaKey : e.ctrlKey)){
				textfield.setValue(null);e.preventDefault();
			}
			if((e.keyCode<48 || e.keyCode>57) && (e.keyCode!=37 && e.keyCode!=39 && e.keyCode!=9)){
				e.preventDefault();
			}
			
			return false;
		};
		listeners.keydown=keydown;
		var allowBlank='';
		if(this.allowBlank != undefined && this.allowBlank ==false){allowBlank='<span style="color:red;">*</span>';}
		if(this.fieldLabel != undefined && this.fieldLabel !=''){
			if($this.width == undefined){$this.width=160;}
			this.emptyText=this.fieldLabel.replace('<br>','');
			this.fieldLabel='<span style="float:left;text-align:left;">'+this.fieldLabel+allowBlank+'</span>';	
		}else{if($this.width == undefined){this.width=60;}}
		Ext.apply(this,{
            listeners: listeners
        });
		this.callParent(arguments);
	},
	listeners:{keypress:function(textfield,eo){if(eo.getCharCode()==Ext.EventObject.ENTER){if(textfield.submit != undefined){Ext.get(textfield.submit).dom.click();}}}},
	val:function(data){
		var value=this.getValue(),format='';
		if(value != null){
			var hour=value.getHours(),minute=value.getMinutes();
			if(hour.toString().length==1){hour='0'+hour.toString();}
			if(minute.toString().length==1){minute='0'+minute.toString();}
			var format=hour+':'+minute;
		}
		return format;
	}
});