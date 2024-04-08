const patientDiseasesForm = [
    {
        dbKey: 'b1',
        label: 'Son 14 gün içerisinde kendinizi veya aile bireylerinizden biri Türkiye dışı bir ülkeye seyahat yaptınız mı ya da yurt dışından gelen kişi / kişiler ile temasta bulundunuzmu',
    },
    {
        dbKey: 'b2',
        label: 'COVID-19 teşhisi konan ya da şüphesi olan bir kişi ile temasta bulundunuz mu?',
    },
    {
        dbKey: 'b3',
        label: 'Son 14 gün içerisinde ateşiniz oldu mu?',
    },
    {
        dbKey: 'b4',
        label: 'Son 14 gün içerisinde öksürük nefes darlığı ile ilgili bir sıkıntı yaşadınız mı?',
    },
    {
        dbKey: 'b5',
        label: 'Son 14 gün içerisinde ateş ve öksürük nefes darlığı gibi solunum sıkıntısı olan birileri ile sıkı temasınız oldu mu?',
    },
    {
        dbKey: 'b6',
        label: 'Çevrenizde benzer hastalık tablosu olan kişi/kişiler var mı?',
    },
    {
        dbKey: 'b7',
        label: 'Yakın zamanda tanımadığınız kimselerle sıkı temasta olduğunuz toplantılara organizasyonlara katıldınız mı',
    },
    {
        dbKey: 'b8',
        label: 'Kalp / şeker / tansiyon / kan sulandırıcı kullanıyor mu?',
    },
    {
        dbKey: 'b9',
        label: 'HEPATİT A',
    },
    {
        dbKey: 'b10',
        label: 'HEPATİT B',
    },
    {
        dbKey: 'b11',
        label: 'HEPATİT C',
    },
    {
        dbKey: 'b12',
        label: 'HİV VİRÜSÜ',
    },
    {
        dbKey: 'b13',
        label: 'Romatizma',
    },
    {
        dbKey: 'l1',
        label: 'Şu anda aşağıdaki bulgulardan hangisine sahipsiniz',
        values: [
            {
                dbKey: 'l1-1',
                label: 'ateş',
            },
            {
                dbKey: 'l1-2',
                label: 'öksürük',
            },
            {
                dbKey: 'l1-3',
                label: 'solunum sıkıntısı',
            },
            {
                dbKey: 'l1-4',
                label: 'boğaz ağırsı',
            },
            {
                dbKey: 'l1-5',
                label: 'kırgınlık',
            },
            {
                dbKey: 'l1-6',
                label: 'ishal',
            },
            {
                dbKey: 'l1-7',
                label: 'baş ağrısı',
            },
            {
                dbKey: 'l1-8',
                label: 'kusma',
            },
            {
                dbKey: 'l1-9',
                label: 'miyalji',
            },
            {
                dbKey: 'l1-10',
                label: 'karın ağrısı',
            },
            {
                dbKey: 'l1-11',
                label: 'hiçbiri',
            },
        ],
    },
];

module.exports = {
    patientDiseasesForm,
};
