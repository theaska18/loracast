<?php defined ( 'BASEPATH' ) or exit ( 'No direct script access allowed' );
class Telegram extends MY_controller {
	function __construct() {parent::__construct();}
	public $TOKEN      = "663415398:AAHyW8svyUtqPsx3x1RoRUBHkdCkODyzki4";
	public $usernamebot= "@sikamalbot";
	public $debug = false;
	public $telegram_service;
	public function index(){
		$entityBody = file_get_contents('php://input');
		$pesanditerima = json_decode($entityBody, true);
		$this->process_message($pesanditerima);
	}
	public function service($id){
		$this->telegram_service=$id;
		$entityBody = file_get_contents('php://input');
		$pesanditerima = json_decode($entityBody, true);
		$this->process_message($pesanditerima);
	}
	function request_url($method){
		return "https://api.telegram.org/bot" . $this->TOKEN . "/". $method;
	}
	 
	// fungsi untuk meminta pesan 
	// bagian ebook di sesi Meminta Pesan, polling: getUpdates
	function get_updates($offset){
		$url = $this->request_url("getUpdates")."?offset=".$offset;
		$resp = file_get_contents($url);
		$result = json_decode($resp, true);
		if ($result["ok"]==1)
			return $result["result"];
		return array();
	}
	// fungsi untuk mebalas pesan, 
	// bagian ebook Mengirim Pesan menggunakan Metode sendMessage
	function send_reply($chatid, $msgid, $text,$keyboard=null){
		$data = array(
			'chat_id' => $chatid,
			'text'  => $text,
			'parse_mode' => "HTML",
			// 'reply_to_message_id' => $msgid   // <---- biar ada reply nya balasannya, opsional, bisa dihapus baris ini
		);
		if($keyboard !=null){
			$data['reply_markup']=json_encode($keyboard);
		}
		$data1 = json_encode($data);
		// write_file('./a.txt', $data1);
		$this->ajaxPost('sendMessage',$data);
	}
	function editMessage($chatid, $msgid, $text,$keyboard=null){
		$data = array(
			'chat_id' => $chatid,
			'text'  => $text,
			'message_id'=>$msgid,
			'parse_mode' => "HTML"
			// 'reply_to_message_id' => $msgid   // <---- biar ada reply nya balasannya, opsional, bisa dihapus baris ini
		);
		if($keyboard !=null){
			$data['reply_markup']=json_encode($keyboard);
		}
		$data1 = json_encode($data);
		// write_file('./a.txt', $data1);
		$res=$this->ajaxPost('editMessageText',$data);
		//write_file('./a.txt',$res);
	}
	function deleteMessage($chatid, $msgid){
		$data = array(
			'chat_id' => $chatid,
			'message_id'  => $msgid
			// 'parse_mode' => "MARKDOWN",
			// 'reply_to_message_id' => $msgid   // <---- biar ada reply nya balasannya, opsional, bisa dihapus baris ini
		);
		if($keyboard !=null){
			$data['reply_markup']=json_encode($keyboard);
		}
		$data1 = json_encode($data);
		//write_file('./a.txt', $data1);
		$res=$this->ajaxPost('deleteMessage',$data);
		//write_file('./a.txt',$res);
	}
	function ajaxPost($method, $data){
		$url = $this->request_url($method);//"https://api.telegram.org/bot<Bot-Token>". "/" . $method;
		if (!$curld = curl_init()) {
			exit;
		}
		curl_setopt($curld, CURLOPT_POST, true);
		// curl_setopt($curld, CURLOPT_HTTPHEADER, array("Content-Type:multipart/form-data"));
		curl_setopt($curld, CURLOPT_POSTFIELDS, $data);
		curl_setopt($curld, CURLOPT_URL, $url);
		curl_setopt($curld, CURLOPT_RETURNTRANSFER, true);
		$output = curl_exec($curld);
		curl_close($curld);
		// write_file('./a.txt', $output);
		return $output;
	}
	 function pinMessage($chatid, $msgid){
		 $data = array(
			'chat_id' => $chatid,
			'message_id' => $msgid   // <---- biar ada reply nya balasannya, opsional, bisa dihapus baris ini
		);
		 $options = array(
			'http' => array(
				'header'  => "Content-type: application/x-www-form-urlencoded\r\n",
				'method'  => 'POST',
				'content' => http_build_query($data),
			),
		);
		$context  = stream_context_create($options); 
		$result = file_get_contents($this->request_url('pinChatMessage'), false, $context);
		if ($this->debug) 
			print_r($result);
	 }
	// fungsi mengolahan pesan, menyiapkan pesan untuk dikirimkan
	function create_response($text, $message){
		$keyboard=null;
		global $usernamebot;
		// inisiasi variable hasil yang mana merupakan hasil olahan pesan
		$hasil = '';  
		$fromid = $message["from"]["id"]; // variable penampung id user
		$chatid = $message["chat"]["id"]; // variable penampung id chat
		$pesanid= $message['message_id']; // variable penampung id message
		// variable penampung username nya user
		isset($message["from"]["username"])
			? $chatuser = $message["from"]["username"]
			: $chatuser = '';
		
		// variable penampung nama user
		isset($message["from"]["last_name"]) 
			? $namakedua = $message["from"]["last_name"] 
			: $namakedua = '';   
		$namauser = $message["from"]["first_name"]. ' ' .$namakedua;
		// ini saya pergunakan untuk menghapus kelebihan pesan spasi yang dikirim ke bot.
		$textur = preg_replace('/\s\s+/', ' ', $text); 
		// memecah pesan dalam 2 blok array, kita ambil yang array pertama saja
		$command = explode(' ',$textur,2); //
	   // identifikasi perintah (yakni kata pertama, atau array pertamanya)
		if(!isset($message['reply_to_message'])){
			if(substr($command[0],0,11)=='\cmd-tenant'){
				$has=$this->func_tenant($message,$command[0]);
				$hasil  = $has['msg'];
				$keyboard =  $has['keyboard'];
			}else{
				switch ($command[0]) {
					case '/start' :
						$obj=$this->query->row("SELECT U.user_code FROM app_employee E 
						   INNER JOIN app_user U ON U.employee_id=E.employee_id 
						   WHERE E.telegram_id=".$fromid);
						 $user_code=' (TIDAK TERDAFTAR)';
						if($obj){
							$user_code=' - '.$obj->user_code;
							$hasil ="Halo <b>$namauser</b>".$user_code.". \n 
								Menu :\n 1. /start - Menu Awal \n 2. /log - Isi LogBook \n 3. /reg - Sambungkan dengan Web Sikamal";
						}else{
							$hasil="Halo <b>$namauser</b>".$user_code.". \n 1. /reg - Sambungkan dengan Web Sikamal";
						}
						//$hasil='awdwd';
						
						// $has=$this->func_start($message);
						// $hasil  = $has['msg'];
						// $keyboard =  $has['keyboard'];
						break;
					case '/id':
					case '/id'.$usernamebot : //dipakai jika di grup yang haru ditambahkan @usernamebot
						$hasil = "$namauser, ID kamu adalah $fromid".json_encode($message);
						break;
					
					// jika ada permintaan waktu
					case '/time':
					case '/time'.$usernamebot :
						$hasil  = "$namauser, waktu lokal bot sekarang adalah :\n";
						$hasil .= date("d M Y")."\nPukul ".date("H:i:s");
						break;
					case '/keyboard'.$usernamebot :
						$hasil  = "keyboard anda";
						$keyboard =  array(
							"inline_keyboard" => array(array(array(
							"text" => "button",
							"callback_data" => "button_0"
							)))
							); 
						break;
					case '/reply'.$usernamebot :
						$hasil  = "Pilih";
						$keyboradsValue = array(
						   array(array("text"=>"Button 1",'callback_data'=>'\id'),"button 2"),
						   array("button 3","button 4"),
						);
						$keyboard = array(
						  // 'keyboard' => $keyboradsValue,
						  'remove_keyboard'=>false,
						  'force_reply' => true,
						  'selective' => true
						);
						break;
					case '/keyboardin'.$usernamebot :
						$hasil  = "Pilih";
						$keyboradsValue = array(
						   array(array("text"=>"Button 1",'callback_data'=>'\id'),"button 2"),
						   array("button 3","button 4"),
						);
						$keyboard = array(
						  'keyboard' => $keyboradsValue,
						  // 'remove_keyboard'=>false,
						  // 'force_reply' => true,
						  'selective' => true
						);
						break;
					case '/log' :
						$date=new DateTime();
						$hasil  = "Halo $namauser, Silahkan Masukan Log Book Tanggal ".$date->format('d M Y');
						$keyboradsValue = array(
						   array(array("text"=>"Button 1",'callback_data'=>'\id'),"button 2"),
						   array("button 3","button 4"),
						);
						$keyboard = array(
						  // 'keyboard' => $keyboradsValue,
						  'remove_keyboard'=>false,
						  'force_reply' => true,
						  'selective' => true
						);
						break;
					case '/reg' :
						$date=new DateTime();
						$hasil  = "[REG] Masukan User Code Akun Sikamal";
						$keyboradsValue = array(
						   array(array("text"=>"Button 1",'callback_data'=>'\id'),"button 2"),
						   array("button 3","button 4"),
						);
						$keyboard = array(
						  // 'keyboard' => $keyboradsValue,
						  'remove_keyboard'=>false,
						  'force_reply' => true,
						  'selective' => true
						);
						break;
					// balasan default jika pesan tidak di definisikan
					default:
						$hasil = 'Terimakasih, pesan telah kami terima.'.json_encode($message);
						break;
				}
			}
		}else{
			$has=explode(' ',$message['reply_to_message']['text'],2);
			switch ($has[0]) {
				case '[REG]' :
					$hasil = 'Sudah terdaftar';
					break;
				default:
					$hasil = 'Terimakasih, pesan telah kami terima.'.json_encode($message['reply_to_message']);
					break;
			}	
		}
		return array('result'=>$hasil,'keyboard'=>$keyboard);
	}
	 
	// fungsi pesan yang sekaligus mengupdate offset 
	// biar tidak berulang-ulang pesan yang di dapat 
	function process_message($message){
		$updateid = $message["update_id"];
		$this->load->helper('file');

					
		if(isset($message["message"])){
			$message_data = $message["message"];
			if(isset($message_data["text"])) {
				$chatid = $message_data["chat"]["id"];
				$message_id = $message_data["message_id"];
				$this->deleteMessage($chatid,$message_id);
				$text = $message_data["text"];
				$response = $this->create_response($text, $message_data);
				if (!empty($response)){
					$data = json_encode($message);
						// if ( ! write_file('./a.txt', $data))
						// {
								// echo 'Unable to write the file';
						// }
						// else
						// {
								// echo 'File written!';
						// }
				  $this->send_reply($chatid, $message_id, $response['result'], $response['keyboard']);
				}
			}
		}else if(isset($message["callback_query"])){
			write_file('./a.txt',json_encode($message));
			$message=$message["callback_query"];
			$message_data = $message["message"];
			if(isset($message_data["text"])) {
				$chatid = $message_data["chat"]["id"];
				$message_id = $message_data["message_id"];
				$text = $message["data"];
				
				$response = $this->create_response($text, $message_data);
				if (!empty($response)){
					
					$data = json_encode($message);
				  $this->editMessage($chatid, $message_id, $response['result'], $response['keyboard']);
				}
			}
			
			
			
			// $data = json_encode($message["callback_query"]).' send '.$message["callback_query"]['message']['chat']['id'].' '.$message["callback_query"]['message']['message_id'].' '.$message["callback_query"]['data'];
						// if ( ! write_file('./a.txt', $data))
						// {
								// echo 'Unable to write the file';
						// }
						// else
						// {
								// echo 'File written!';
						// }
			// $this->send_reply($message["callback_query"]['message']['chat']['id'], $message["callback_query"]['message']['message_id'],$message["callback_query"]['data'],null);
			//$this->send_callbaack($message["callback_query"]['id'],$message["callback_query"]['data']);
		}
		return $updateid;
	}
	function send_callbaack($callback_id,$data){
		$data = array(
			'callback_query_id' => $callback_id,// <---- biar ada reply nya balasannya, opsional, bisa dihapus baris ini
			'text'=>$data
		);
		$this->ajaxPost('answerCallbackQuery',$data);
	}
	
	function func_start($message){
		$fromid = $message["from"]["id"];
		$chatid = $message["chat"]["id"];
		isset($message["chat"]["last_name"]) 
			? $namakedua = $message["chat"]["last_name"] 
			: $namakedua = '';   
		$namauser = $message["chat"]["first_name"]. ' ' .$namakedua;
		$kmsg="Selamata Datang <b>".$namauser."</b>.\n";
		$kmsg.="Balas /start Untuk memulai dari awal,\n";
		$kmsg.="Tekan Tombol Nama Perusahaan yang akan dituju :";
		$res=$this->query->result("SELECT E.tenant_id,T.tenant_name FROM app_employee E 
		   INNER JOIN app_tenant T ON T.tenant_id=E.tenant_id 
		   WHERE  (T.telegram_flag=1 OR E.telegram_id='".$chatid."') AND T.telegram_service='".$this->telegram_service."' GROUP BY E.tenant_id");
			
			// "SELECT E.tenant_id,T.tenant_name FROM app_employee E 
			// INNER JOIN app_tenant T ON T.tenant_id=E.tenant_id 
			// WHERE E.telegram_id='".$fromid."' AND T.telegram_flag=1 GROUP BY E.tenant_id"
		$arrMenu=array();
		for($i=0,$iLen=count($res);$i<$iLen;$i++){
			$obj=$res[$i];
			$arrMenu[]=array(array("text" => "\xF0\x9F\x8C\x86 ".$obj->tenant_name,"callback_data" => "\cmd-tenant#@#".$obj->tenant_id."#@#".$fromid));
		}
		$keyboard=null;
		$keyboard=array(
			"inline_keyboard" => $arrMenu
		);
		return array('msg'=>$kmsg,'keyboard'=>$keyboard);
	}
	function func_tenant($message,$text){
		$messages = explode('#@#',$text);
		
		$fromid = $message["from"]["id"];
		$chatid = $message["chat"]["id"];
		isset($message["from"]["last_name"]) 
			? $namakedua = $message["from"]["last_name"] 
			: $namakedua = '';  
		$pesanid= $message['message_id'];
		$namauser = $message["from"]["first_name"]. ' ' .$namakedua;
		$obj=$this->query->row("SELECT E.tenant_id,T.tenant_name,T.telegram_flag,MAX(CASE WHEN E.telegram_id='".$chatid."' THEN 1 ELSE 0 END) AS cpanel_flag FROM app_employee E 
		   INNER JOIN app_tenant T ON T.tenant_id=E.tenant_id 
		   WHERE  (T.telegram_flag=1 OR E.telegram_id='".$chatid."') AND T.telegram_service='".$this->telegram_service."' GROUP BY E.tenant_id");
		$kmsg="Anda Masuk ke Menu <b>".$obj->tenant_name."</b>.\n";
		$kmsg.="Balas /start Untuk memulai dari awal,\n";
		$kmsg.="Tekan Tombol Menu yang akan dituju :";
		// $arrMenu=array();
		// $arrTop=array();
		// $arrTop[]=array("text" => "\xF0\x9F\x8C\x86 Halaman Menu","callback_data" => "\cmd-tenant#@#".$obj->tenant_id."#@#".$fromid);
		// if($obj->cpanel_flag==1){
			// $arrTop[]=array("text" => "\xF0\x9F\x8C\x86 Ke CPanel","callback_data" => "\cmd-login#@#".$obj->tenant_id."#@#".$pesanid);
		// }
		
		
		$arrMenu=array();

		$arrMenu[]=array(array("text" => "\xF0\x9F\x8C\x86 Halaman Menu","callback_data" => "\cmd-tenant#@#".$obj->tenant_id."#@#".$fromid));
		if($obj->cpanel_flag==1){
			$arrMenu[]=array(array("text" => "\xF0\x9F\x8C\x86 Ke CPanel","callback_data" => "\cmd-login#@#".$obj->tenant_id."#@#".$pesanid));
		}
		$arrMenu[]=array(array("text" => "\xE2\xAC\x85 Kembali","callback_data" => "/start"));
			
		$keyboard=null;
		$keyboard=array(
			"inline_keyboard" => $arrMenu
		);
		return array('msg'=>$kmsg,'keyboard'=>$keyboard);
	}
// metode webhook
// secara normal, hanya bisa digunakan secara bergantian dengan polling
// aktifkan ini jika menggunakan metode webhook
/*
$entityBody = file_get_contents('php://input');
$pesanditerima = json_decode($entityBody, true);
process_message($pesanditerima);
*/
/*
 * -----------------------
 * Grup @botphp
 * Jika ada pertanyaan jangan via PM
 * langsung ke grup saja.
 * ----------------------
 
* Just ask, not asks for ask..
Sekian.
*/
}