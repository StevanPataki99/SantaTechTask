-- CreateTable
CREATE TABLE "song" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "uploaderId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "artist" TEXT,
    "durationSec" INTEGER,
    "filePath" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "sizeBytes" BIGINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "song_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pitch" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "songId" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pitch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tag" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pitch_tag" (
    "pitchId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,

    CONSTRAINT "pitch_tag_pkey" PRIMARY KEY ("pitchId","tagId")
);

-- CreateTable
CREATE TABLE "pitch_target_artist" (
    "id" TEXT NOT NULL,
    "pitchId" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "pitch_target_artist_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "song_organizationId_createdAt_idx" ON "song"("organizationId", "createdAt");

-- CreateIndex
CREATE INDEX "song_uploaderId_createdAt_idx" ON "song"("uploaderId", "createdAt");

-- CreateIndex
CREATE INDEX "pitch_organizationId_createdAt_idx" ON "pitch"("organizationId", "createdAt");

-- CreateIndex
CREATE INDEX "pitch_songId_idx" ON "pitch"("songId");

-- CreateIndex
CREATE INDEX "pitch_createdById_createdAt_idx" ON "pitch"("createdById", "createdAt");

-- CreateIndex
CREATE INDEX "tag_organizationId_idx" ON "tag"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "tag_organizationId_name_key" ON "tag"("organizationId", "name");

-- CreateIndex
CREATE INDEX "pitch_tag_tagId_idx" ON "pitch_tag"("tagId");

-- CreateIndex
CREATE INDEX "pitch_target_artist_pitchId_idx" ON "pitch_target_artist"("pitchId");

-- CreateIndex
CREATE INDEX "pitch_target_artist_name_idx" ON "pitch_target_artist"("name");

-- CreateIndex
CREATE UNIQUE INDEX "pitch_target_artist_pitchId_name_key" ON "pitch_target_artist"("pitchId", "name");

-- AddForeignKey
ALTER TABLE "song" ADD CONSTRAINT "song_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "song" ADD CONSTRAINT "song_uploaderId_fkey" FOREIGN KEY ("uploaderId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pitch" ADD CONSTRAINT "pitch_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pitch" ADD CONSTRAINT "pitch_songId_fkey" FOREIGN KEY ("songId") REFERENCES "song"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pitch" ADD CONSTRAINT "pitch_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tag" ADD CONSTRAINT "tag_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pitch_tag" ADD CONSTRAINT "pitch_tag_pitchId_fkey" FOREIGN KEY ("pitchId") REFERENCES "pitch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pitch_tag" ADD CONSTRAINT "pitch_tag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pitch_target_artist" ADD CONSTRAINT "pitch_target_artist_pitchId_fkey" FOREIGN KEY ("pitchId") REFERENCES "pitch"("id") ON DELETE CASCADE ON UPDATE CASCADE;
