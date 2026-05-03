const fs = require("fs").promises;
const { readfile, readFile } = require("fs/promises");
const input = require('readline-sync');

class HUMANIORA {
    constructor(jumlahsks, nama, tugas, UTS, UAS){
        this.sks = jumlahsks;
        this.matakuliah = nama;
        this.tugasmatkul = tugas;
        this.utsmatkul = UTS;
        this.uasmatkul = UAS;
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

    while (pilihan != 3){
        pilihan = input.questionInt("1.UMUM/2.BIDANG/3.EXIT");
            if(pilihan === 1){
                let jumlahsks = input.questionInt("Berapa SKS pada mata kuliah ini : ");
                let nama = input.question("apa nama mata kuliah ini : ");
                let tugas = input.questionFloat("Berapa nilai tugas anda : ");
                let UTS = input.questionFloat("Berapa nilai UTS anda : ");         
                let UAS = input.questionFloat("Berapa nilai UAS anda : ");   
                
                let dataBARU = new HUMANIORA(jumlahsks, nama, tugas, UTS, UAS);
                daftardata.push(dataBARU);
                await pushdata(namafile, daftardata);
                console.log("Berhasil menambahkan data");
            }
    }
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
    let namafileload = input.question("Masukan namafile json : ");
    try{
        if(namafileload.length === 0){
            console.log("File tidak memiliki isi, silahkan buat terlebih dahulu");
            console.log("Memasuki mode newdata");
            await newdata();
        } else {
            console.log("File saat ini : ", `${namafileload}.json`);
            const datajson = await fs.readFile(`${namafileload}.json`, 'utf-8');
            const daftarmatkul = JSON.parse(datajson);
            if(daftarmatkul.length === 0){
                console.log("Tidak ada isinya");
            } else {
                daftarmatkul.forEach((item, index) => {
                    console.log(`${index+1}. Mata kuliah: ${item.matakuliah}`);
                    console.log(`SKS: ${item.sks}`);
                    console.log(`Tugas: ${item.tugasmatkul}`);
                    console.log(`UTS: ${item.utsmatkul}`);
                    console.log(`UAS: ${item.uasmatkul}`);
                });
            }
        }
    } catch (error) {
        console.error("Gagal load file :", error.message);
    }
}
async function loadDATA(){
    await loadfile();
}
async function main(){
    console.log("Gradebook GPA system");
    console.log("1. New data");
    console.log("2. Load data");
    let pilihan = input.question("Pilih :");
    switch(pilihan){
        case "1":
            await newdata();
            break;
        case "2":
            await loadDATA();
            break;
    }
}   
main();