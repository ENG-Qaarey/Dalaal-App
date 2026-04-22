import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { CreateConversationDto, CreateMessageDto } from './dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Chat')
@Controller('chat')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('conversations')
  @ApiOperation({ summary: 'Create a new conversation' })
  async createConversation(@CurrentUser() user: any, @Body() dto: CreateConversationDto) {
    return this.chatService.createConversation(user.id, dto);
  }

  @Get('conversations')
  @ApiOperation({ summary: 'Get all user conversations' })
  async getConversations(@CurrentUser() user: any) {
    return this.chatService.getConversations(user.id);
  }

  @Get('conversations/:id/messages')
  @ApiOperation({ summary: 'Get messages in a conversation' })
  async getMessages(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Query('page') page = 1,
    @Query('limit') limit = 50,
  ) {
    return this.chatService.getMessages(id, user.id, +page, +limit);
  }

  @Post('conversations/:id/messages')
  @ApiOperation({ summary: 'Send a message' })
  async sendMessage(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() dto: CreateMessageDto,
  ) {
    return this.chatService.sendMessage(id, user.id, dto);
  }
}
