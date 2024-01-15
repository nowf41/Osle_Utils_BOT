const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const lucks = ['大吉', '吉', '中吉', '小吉', '末吉', '凶', '大凶'];
const omikuji_jinoBun_base = [
    '巫女さんが見守る中、おみくじ代を入れた...\n\n',
    '100円硬貨が箱の中に落ちる音が心地いい...\n\n',
    '(さて、どれにしようか...)\n\n',
    '目を閉じて良いものが出てくることを祈りながらおみくじを選んだ。\n\n',
    'そして選んだおみくじを開いた。\n\n',
    '',
    'おみくじを引いてくれてありがとう！また挑戦してね！\n\n'
];
let alreadyPlayedPeople = [];
const messagesFilePath = '../../res/messages/commands/omikuji.json'

function generateOmikujiEmbed(luck /* 運勢インデックス */, index /* 何番目の演出か. {x|0≦x≦3∧x∈𝕎}  */) {
    const luckText = lucks[luck];
    if(!luckText) throw new Error('Unknown luck index');
    let omikuji_jinoBun_cache = omikuji_jinoBun_base;
    omikuji_jinoBun_cache[5] = 'そこには、`' + luckText + '`と書かれていた。\n\n'
    let embedText = '';
    for(let i = 0; i <= index; i++) embedText += omikuji_jinoBun_cache[i];
    const embed = new EmbedBuilder()
        .setColor('Yellow')
        .setDescription(embedText);
    return embed;
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('omikuji')
        .setDescription('draw a Omikuji.')
        .setDescriptionLocalization('ja', 'おみくじを引きます。'),
        async execute(interaction, calledBy = 'interactionCreate') {
            const luckIndex = Math.floor(Math.random() * lucks.length);
            if(calledBy === 'interactionCreate') {
                if(!alreadyPlayedPeople.includes(interaction.user.id)){
                    alreadyPlayedPeople += interaction.user.id;
                } else {
                    interaction.reply(`${interaction.member}->今日はもうおみくじ引いたでしょ！Botの再起動が1日おきに入るから入ったときにまた引かせてあげる！ `);
                    return;
                }
            } else if(calledBy === 'messageCreate') {
                if(!alreadyPlayedPeople.includes(interaction.author.id)){
                    alreadyPlayedPeople += interaction.author.id;
                } else {
                    interaction.reply({content: require(messagesFilePath).errorMessage.alreadyDrewOmikuji, ephemeral: true});
                    return;
                }
            }
            const reply = await interaction.reply(`${interaction.member}->`);
            setTimeout(async () => await reply.edit({embeds: [generateOmikujiEmbed(luckIndex, 0)]}), 2000);
            setTimeout(async () => await reply.edit({embeds: [generateOmikujiEmbed(luckIndex, 1)]}), 4000);
            setTimeout(async () => await reply.edit({embeds: [generateOmikujiEmbed(luckIndex, 2)]}), 6000);
            setTimeout(async () => await reply.edit({embeds: [generateOmikujiEmbed(luckIndex, 3)]}), 8000);
            setTimeout(async () => await reply.edit({embeds: [generateOmikujiEmbed(luckIndex, 4)]}), 10000);
            setTimeout(async () => await reply.edit({embeds: [generateOmikujiEmbed(luckIndex, 5)]}), 12000);
            setTimeout(async () => await reply.edit({embeds: [generateOmikujiEmbed(luckIndex, 6)]}), 14000);
        }
}