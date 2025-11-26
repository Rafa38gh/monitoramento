-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `senha` VARCHAR(191) NOT NULL,
    `role` VARCHAR(191) NOT NULL,
    `resetToken` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Lote` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `codigo` VARCHAR(191) NOT NULL,
    `chegada` DATETIME(3) NOT NULL,
    `custo` DOUBLE NOT NULL,
    `gasto_alimentacao` DOUBLE NULL,
    `data_venda` DATETIME(3) NULL,
    `vacinado` BOOLEAN NOT NULL DEFAULT false,
    `data_vacinacao` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Boi` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `peso` DOUBLE NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `alerta` VARCHAR(191) NULL,
    `anotacoes` VARCHAR(191) NULL,
    `loteId` INTEGER NOT NULL,

    INDEX `Boi_loteId_fkey`(`loteId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PesoHistorico` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `peso` DOUBLE NOT NULL,
    `dataPesagem` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `boiId` INTEGER NOT NULL,
    `loteId` INTEGER NOT NULL,

    INDEX `PesoHistorico_boiId_fkey`(`boiId`),
    INDEX `PesoHistorico_loteId_fkey`(`loteId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Venda` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `dataVenda` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `valor` DOUBLE NOT NULL,
    `loteId` INTEGER NOT NULL,

    INDEX `Venda_loteId_fkey`(`loteId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Configuracao` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `chave` VARCHAR(191) NOT NULL,
    `valor` VARCHAR(191) NOT NULL,
    `atualizadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Configuracao_chave_key`(`chave`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Notificacao` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `titulo` VARCHAR(191) NOT NULL,
    `mensagem` VARCHAR(191) NOT NULL,
    `lida` BOOLEAN NOT NULL DEFAULT false,
    `tipo` VARCHAR(191) NOT NULL,
    `remetenteId` INTEGER NOT NULL,
    `destinatarioId` INTEGER NOT NULL,
    `loteId` INTEGER NULL,
    `boiId` INTEGER NULL,
    `respostaDeId` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Notificacao_boiId_fkey`(`boiId`),
    INDEX `Notificacao_destinatarioId_fkey`(`destinatarioId`),
    INDEX `Notificacao_loteId_fkey`(`loteId`),
    INDEX `Notificacao_remetenteId_fkey`(`remetenteId`),
    INDEX `Notificacao_respostaDeId_fkey`(`respostaDeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Boi` ADD CONSTRAINT `Boi_loteId_fkey` FOREIGN KEY (`loteId`) REFERENCES `Lote`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PesoHistorico` ADD CONSTRAINT `PesoHistorico_boiId_fkey` FOREIGN KEY (`boiId`) REFERENCES `Boi`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PesoHistorico` ADD CONSTRAINT `PesoHistorico_loteId_fkey` FOREIGN KEY (`loteId`) REFERENCES `Lote`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Venda` ADD CONSTRAINT `Venda_loteId_fkey` FOREIGN KEY (`loteId`) REFERENCES `Lote`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notificacao` ADD CONSTRAINT `Notificacao_boiId_fkey` FOREIGN KEY (`boiId`) REFERENCES `Boi`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notificacao` ADD CONSTRAINT `Notificacao_destinatarioId_fkey` FOREIGN KEY (`destinatarioId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notificacao` ADD CONSTRAINT `Notificacao_loteId_fkey` FOREIGN KEY (`loteId`) REFERENCES `Lote`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notificacao` ADD CONSTRAINT `Notificacao_remetenteId_fkey` FOREIGN KEY (`remetenteId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notificacao` ADD CONSTRAINT `Notificacao_respostaDeId_fkey` FOREIGN KEY (`respostaDeId`) REFERENCES `Notificacao`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
