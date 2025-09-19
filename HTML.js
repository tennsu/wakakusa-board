const supabaseUrl = "https://amacjdbgauaaeicrzgxc.supabase.co"; // Supabase URL
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtYWNqZGJnYXVhYWlpY3J6Z3hjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyNzU5MzcsImV4cCI6MjA3Mzg1MTkzN30.wS-MpPFY5jwegyG2FVwhvF_GHU-vMWeEBbOOo9cNtmw"; // Supabase API Key

const supabase = supabase.createClient(supabaseUrl, supabaseKey);

let localStream;
let videoTrack;
let audioTrack;

// 通話開始
async function startCall() {
    try {
        localStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
        videoTrack = localStream.getVideoTracks()[0];
        audioTrack = localStream.getAudioTracks()[0];
        
        const localVideo = document.getElementById('localVideo');
        localVideo.srcObject = localStream;

        // 通話の接続をここに追加 (例: RTCPeerConnection)
        const peerConnection = new RTCPeerConnection();
        peerConnection.addTrack(videoTrack, localStream);
        peerConnection.addTrack(audioTrack, localStream);

        // 他の通話関連の処理（オファーや応答など）をここに追加
    } catch (error) {
        console.error('メディアの取得に失敗しました:', error);
    }
}

// 部屋を作成
async function createRoom(roomPassword) {
    const { data, error } = await supabase
        .from('rooms')
        .insert([{ password: roomPassword, created_at: new Date() }]);
    if (error) console.error("部屋作成に失敗:", error);
    else console.log("部屋作成:", data);
}

// 部屋情報を取得
async function getRoom(roomPassword) {
    const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .eq('password', roomPassword)
        .single();
    if (error) console.error("部屋の取得に失敗:", error);
    else console.log("部屋情報:", data);
}

// 部屋に参加
async function joinRoom(roomPassword) {
    const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .eq('password', roomPassword)
        .single();

    if (error) {
        console.log("その部屋は存在しません。新しい部屋を作成します。");
        createRoom(roomPassword); // 部屋が存在しない場合、新しい部屋を作成
    } else {
        console.log("部屋に参加:", data);
        startCall(); // 部屋に参加したら通話開始
    }
}

// カメラのオン/オフ
document.getElementById('toggleVideo').addEventListener('click', () => {
    if (videoTrack.enabled) videoTrack.enabled = false;
    else videoTrack.enabled = true;
});

// マイクのオン/オフ
document.getElementById('toggleAudio').addEventListener('click', () => {
    if (audioTrack.enabled) audioTrack.enabled = false;
    else audioTrack.enabled = true;
});
