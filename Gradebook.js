const fs = require("fs").promises;
const { readfile, readFile } = require("fs/promises");
const input = require('readline-sync');

class HUMANIORA {
    constructor(jumlahsks, nama, tugas, UTS, UAS, sikap, Psikap, Ptugas, PUTS, PUAS){
        this.tipe = "Humaniora";
        this.sks = jumlahsks;
        this.matakuliah = nama;
        this.tugasmatkul = tugas;
        this.utsmatkul = UTS;
        this.uasmatkul = UAS;
        this.sikapmatkul = sikap;
        this.persensikap = Psikap;
        this.persentugas = Ptugas;
        this.persenUTS = PUTS;
        this.persenUAS = PUAS;
    }
}

class BIDANG {
    constructor(jumlahsks, nama, tugas, UTS, UAS, Ptugas, PUTS, PUAS){
        this.tipe = "Bidang";
        this.sks = jumlahsks;
        this.matakuliah = nama;
        this.tugasmatkul = tugas;
        this.utsmatkul = UTS;
        this.uasmatkul = UAS;

        this.persentugas = Ptugas;
        this.persenUTS = PUTS;
        this.persenUAS = PUAS;
    }
}


async function buatTXTbaru(){ //function sendiri untuk newdata;
    let namafile = input.question("Masukan nama file yang di inginkan : ");
    try {
        await fs.writeFile(`${namafile}.json`, konten, 'utf-8');
        console.log("File sudah berhasil di buat");
    } catch (error){
        console.error("File tidak berhasil di buat");
        console.error("Problem :", error.message);
    }   
}

async function nambahdata(namafile){
    let pilihan = 0;
    let daftardata = [];
    try {
        const datalama = await fs.readFile(`${namafile}.json`, 'utf-8');
        daftardata = JSON.parse(datalama);
        console.log(`Sistem berhasil memuat ${daftardata.length}`);
    } catch {
        daftardata = [];
    }
    while (pilihan != 3){
        pilihan = input.questionInt("1.UMUM/2.BIDANG/3.EXIT : ");
            if(pilihan === 1 || pilihan === 2){
                let jumlahsks = input.questionInt("Berapa SKS pada mata kuliah ini : ");
                let nama = input.question("apa nama mata kuliah ini : ");
                let tugas = input.questionFloat("Berapa nilai tugas anda : ");
                let persentugas = input.questionFloat("Berapa persen nilai tugas: ");

                let UTS = input.questionFloat("Berapa nilai UTS anda : ");         
                let persenUTS = input.questionFloat("Berapa persen nilai UTS: ");

                let UAS = input.questionFloat("Berapa nilai UAS anda : ");   
                let persenUAS = input.questionFloat("Berapa persen nilai UAS: ");

                let dataBARU;
                if (pilihan === 1){
                    let sikap = input.questionFloat("Berapa nilai skap anda :");
                    let persensikap = input.questionFloat("Berapa persen nilai sikap :");
                    dataBARU = new HUMANIORA(jumlahsks, nama, tugas, UTS, UAS, sikap, persensikap, persentugas, persenUTS, persenUAS);
                } else if (pilihan === 2){
                    dataBARU = new BIDANG(jumlahsks, nama, tugas, UTS, UAS, persentugas, persenUTS, persenUAS);
                }
                daftardata.push(dataBARU);
                console.log("Berhasil menambahkan data");
        }
    }
    await pushdata(namafile, daftardata);
    return daftardata;
}
async function pushdata(namafile, arraydata){
    try{
        const konten = JSON.stringify(arraydata, null, 2 );
        await fs.writeFile(`${namafile}.json`, konten, 'utf-8');
        console.log("Data berhasil di buat");
    } catch (error){
        console.error("Error :", error.message);
    }
}
async function newdata(){
    let namafile = input.question("Masukan nama file : ");
    await nambahdata(namafile);
    console.log("Data sudah di push!");
}
async function loadfile(){
    namafileload = input.question("Masukan namafile json : ");
    try{
        if(namafileload.length === 0){
            console.log("File tidak memiliki isi, silahkan buat terlebih dahulu");
            console.log("Memasuki mode newdata");
            await newdata();
        } 

        console.log("File saat ini : ", `${namafileload}.json`);
        const datajson = await fs.readFile(`${namafileload}.json`, 'utf-8');
        const daftarmatkul = JSON.parse(datajson);
        if(daftarmatkul.length === 0){
            console.log("Tidak ada isinya");
        } else {
            daftarmatkul.forEach((item, index) => {
                console.log(`${index+1}. Mata kuliah: ${item.matakuliah}`);
                console.log(`SKS: ${item.sks}`);
                console.log(`Tugas: ${item.tugasmatkul} | Bobot: ${item.persentugas}`);
                console.log(`UTS: ${item.utsmatkul} | Bobot: ${item.persenUTS}`);
                console.log(`UAS: ${item.uasmatkul} | Bobot: ${item.persenUAS}`);
                if(item.sikapmatkul !== undefined){
                    console.log(`SIKAP: ${item.sikapmatkul} | Bobot: ${item.persensikap}`);
                } 
            });
        }
        return namafileload;
    } catch (error) {
        console.error("Gagal load file :", error.message);
        return null;
    }
}
async function loadDATA(){
    let namafilenow = await loadfile();
        if(namafilenow){
            let pilihan = input.question("tambah data (y/n) : ");
        if(pilihan === "y"){
            await nambahdata(namafilenow);
        } else {
            console.log("Data tidak di tambahkan");
        }
    } else {
        console.log("Gagal menambahkan data");
    }
}
async function hitungipk(){
    try {
        let namafile = input.question("Masukan nama file yang ingin dihitung: ");
        const datajson = await fs.readFile(`${namafile}.json`, 'utf-8');
        const daftarmatkul = JSON.parse(datajson); //proses mengubah teks jadi smth yang bisa di olah oleh js

        let totalpoin = 0;
        let totalsks = 0;
        daftarmatkul.forEach((item) => {
            let hitung = 0;
            if(item.tipe === "Humaniora"){ //untuk humaniora
                hitung = (item.tugasmatkul * (item.persentugas / 100)) + (item.utsmatkul * (item.persenUTS / 100)) + (item.uasmatkul * (item.persenUAS / 100)) + (item.sikapmatkul * (item.persensikap / 100));
            } else {
                hitung = (item.tugasmatkul * (item.persentugas / 100)) + (item.utsmatkul * (item.persenUTS / 100)) + (item.uasmatkul * (item.persenUAS / 100));
            }

            let bobot = 0;
            if(hitung >= 85){
                bobot = 4.0;
            } else if(hitung >= 80){
                bobot = 3.7;            
            } else if(hitung >= 75){
                bobot = 3.3;
            } else if(hitung >= 70){
                bobot = 3.0;
            } else if(hitung >= 65){
                bobot = 2.7;
            } else if(hitung >= 60){
                bobot = 2.3;
            } else if(hitung >= 55){
                bobot = 2.0;
            } else if(hitung >= 45){
                bobot = 1.0;
            } else if (hitung < 45){
                bobot = 0;
            }

            totalpoin += (bobot * item.sks);
            totalsks += item.sks;
            console.log(`[${item.matakuliah}]: Nilai = ${hitung.toFixed(2)}`);
        });
        if(totalsks > 0){
            let ipk = totalpoin/totalsks;
            console.log(`Total sks : ${totalsks}`);
            console.log(`Total GPA : ${ipk.toFixed(2)}`);
        }
    } catch(error){
        console.log("Error:", error.message);
    }
}

async function whatifnilai(){
    let targetakhir = input.question("Ingin mencari nilai berapa? : ");
    let pilihan = input.question("(1) Humaniora / (2) Bidang : ");
    console.log("Tulis 0 pada nilai yang belum ada");
    while(pilihan != 3){
        if(pilihan === 1 || pilihan === 2 ){
            let tugas = input.questionFloat("Berapa nilai tugas anda : ");
            let persentugas = input.questionFloat("Berapa persen nilai tugas: ");

            let UTS = input.questionFloat("Berapa nilai UTS anda : ");         
            let persenUTS = input.questionFloat("Berapa persen nilai UTS: ");

            let UAS = input.questionFloat("Berapa nilai UAS anda : ");   
            let persenUAS = input.questionFloat("Berapa persen nilai UAS: ");

            let dataBARU;
            if (pilihan === 1){
                let sikap = input.questionFloat("Berapa nilai skap anda :");
                let persensikap = input.questionFloat("Berapa persen nilai sikap :");
            } 
        }
    if (pilihan === 1){
        poinsaatini = (tugas *(persentugas / 100)) + (UTS *(persenUTS / 100)) + (UAS *(persenUAS / 100)) + (sikap*(persensikap / 100));
        if (tugas === 0){ bobotkosong = Ptugas; namakomponen = "tugas";}
        else if (UTS === 0){ bobotkosong = PUTS; namakomponen = "uts";}
        else if (UAS === 0){ bobotkosong = PUAS; namakomponen = "uas";}
        else if (sikap === 0){ bobotkosong = persensikapsikap; namakomponen = "sikap";}
    } else {
        poinsaatini = (tugas *(persentugas / 100)) + (UTS *(persenUTS / 100)) + (UAS *(persenUAS / 100))
        if (tugas === 0){ bobotkosong = Ptugas; namakomponen = "tugas";}
        else if (UTS === 0){ bobotkosong = PUTS; namakomponen = "uts";}
        else if (UAS === 0){ bobotkosong = PUAS; namakomponen = "uas";}
    }
    if (namakomponen != ""){
        let butuhpoin = targetakhir - poinsaatini;
        let nilaidibutuhkan = butuhpoin / (bobotkosong / 100);
        console.log(`Kamu butuh nilai ${komponen} sebeesar nilai ${nilaidibutuhkan.toFixed(2)}`);
    }
}
}
async function whatif(){
    console.log("Perintah ini di gunakan untuk menjadi patokan nilai yang harus di kejar untuk mencapai suatu gpa yang di inginkan");
    console.log("1. What if (Nilai matakuliah)");
    console.log("2. What if (Nilai Keseluruhan)");
    let pilihan = input.question("Pilih : ");
    switch(pilihan){
        case "1":
            await whatifmatakuliah();
            break;
    }
}
async function main(){
    console.log("Gradebook GPA system");
    console.log("1. New data");
    console.log("2. Load data");
    console.log("3. Hitung data");
    console.log("4. What if nilai");  
    let pilihan = input.question("Pilih :");
    switch(pilihan){
        case "1":
            await newdata();
            break;
        case "2":
            await loadDATA();
            break;
        case "3":
            await hitungipk();
            break;
        case "4":
            await whatifnilai();
            break;
    }
}           
main();